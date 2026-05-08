package com.wiki.controller;

import com.wiki.dto.comment.CommentRequest;
import com.wiki.dto.comment.CommentResponse;
import com.wiki.security.AuthenticatedUser;
import com.wiki.service.CommentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/pages/{pageId}/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping
    public ResponseEntity<List<CommentResponse>> list(@PathVariable UUID pageId) {
        return ResponseEntity.ok(commentService.getComments(pageId));
    }

    @PostMapping
    public ResponseEntity<CommentResponse> create(@PathVariable UUID pageId,
                                                    @Valid @RequestBody CommentRequest req,
                                                    @AuthenticationPrincipal AuthenticatedUser user) {
        return ResponseEntity.status(201).body(commentService.createComment(pageId, req, user));
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<CommentResponse> update(@PathVariable UUID pageId,
                                                    @PathVariable UUID commentId,
                                                    @Valid @RequestBody CommentRequest req,
                                                    @AuthenticationPrincipal AuthenticatedUser user) {
        return ResponseEntity.ok(commentService.updateComment(pageId, commentId, req, user));
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> delete(@PathVariable UUID pageId,
                                        @PathVariable UUID commentId,
                                        @AuthenticationPrincipal AuthenticatedUser user) {
        commentService.deleteComment(pageId, commentId, user);
        return ResponseEntity.noContent().build();
    }
}
