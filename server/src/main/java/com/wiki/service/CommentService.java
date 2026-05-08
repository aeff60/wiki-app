package com.wiki.service;

import com.wiki.dto.comment.CommentRequest;
import com.wiki.dto.comment.CommentResponse;
import com.wiki.entity.Comment;
import com.wiki.entity.User;
import com.wiki.exception.ApiException;
import com.wiki.repository.CommentRepository;
import com.wiki.repository.PageRepository;
import com.wiki.repository.UserRepository;
import com.wiki.security.AuthenticatedUser;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final PageRepository pageRepository;
    private final UserRepository userRepository;

    public CommentService(CommentRepository commentRepository, PageRepository pageRepository,
                          UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.pageRepository = pageRepository;
        this.userRepository = userRepository;
    }

    public List<CommentResponse> getComments(UUID pageId) {
        pageRepository.findById(pageId)
                .orElseThrow(() -> new ApiException(404, "Page not found"));
        return commentRepository.findByPageIdWithAuthor(pageId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public CommentResponse createComment(UUID pageId, CommentRequest req, AuthenticatedUser currentUser) {
        pageRepository.findById(pageId)
                .orElseThrow(() -> new ApiException(404, "Page not found"));
        Comment comment = new Comment();
        comment.setPageId(pageId);
        User author = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ApiException(404, "User not found"));
        comment.setAuthor(author);
        comment.setContent(req.content());
        comment.setParentId(req.parentId());
        comment = commentRepository.save(comment);
        return toResponse(comment);
    }

    @Transactional
    public CommentResponse updateComment(UUID pageId, UUID commentId, CommentRequest req,
                                          AuthenticatedUser currentUser) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ApiException(404, "Comment not found"));
        if (!comment.getPageId().equals(pageId)) throw new ApiException(404, "Comment not found");
        checkOwnership(comment, currentUser);
        comment.setContent(req.content());
        comment = commentRepository.save(comment);
        return toResponse(comment);
    }

    @Transactional
    public void deleteComment(UUID pageId, UUID commentId, AuthenticatedUser currentUser) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ApiException(404, "Comment not found"));
        if (!comment.getPageId().equals(pageId)) throw new ApiException(404, "Comment not found");
        checkOwnership(comment, currentUser);
        comment.setDeleted(true);
        comment.setContent("[deleted]");
        commentRepository.save(comment);
    }

    private void checkOwnership(Comment comment, AuthenticatedUser user) {
        if ("admin".equals(user.getRole())) return;
        if (!comment.getAuthor().getId().equals(user.getId())) {
            throw new ApiException(403, "Forbidden");
        }
    }

    private CommentResponse toResponse(Comment comment) {
        return new CommentResponse(
                comment.getId(),
                comment.getPageId(),
                comment.getAuthor().getId(),
                comment.getAuthor().getName(),
                comment.isDeleted() ? null : comment.getContent(),
                comment.getParentId(),
                comment.isDeleted(),
                comment.getCreatedAt(),
                comment.getUpdatedAt()
        );
    }
}
