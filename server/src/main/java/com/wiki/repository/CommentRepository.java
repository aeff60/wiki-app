package com.wiki.repository;

import com.wiki.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface CommentRepository extends JpaRepository<Comment, UUID> {
    @Query("SELECT c FROM Comment c LEFT JOIN FETCH c.author WHERE c.pageId = :pageId ORDER BY c.createdAt ASC")
    List<Comment> findByPageIdWithAuthor(@Param("pageId") UUID pageId);
}
