package com.wiki.dto.comment;

import java.time.OffsetDateTime;
import java.util.UUID;

public record CommentResponse(
        UUID id,
        UUID pageId,
        UUID authorId,
        String authorName,
        String content,
        UUID parentId,
        boolean isDeleted,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {}
