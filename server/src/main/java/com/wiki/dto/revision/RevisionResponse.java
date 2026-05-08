package com.wiki.dto.revision;

import java.time.OffsetDateTime;
import java.util.UUID;

public record RevisionResponse(
        UUID id,
        UUID pageId,
        String title,
        String content,
        UUID authorId,
        String authorName,
        int revisionNumber,
        String changeSummary,
        OffsetDateTime createdAt
) {}
