package com.wiki.dto.page;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public record PageResponse(
        UUID id,
        UUID spaceId,
        UUID parentId,
        String title,
        String slug,
        String content,
        UUID authorId,
        String authorName,
        boolean isPublished,
        int viewCount,
        List<TagDto> tags,
        List<PageResponse> children,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {
    public record TagDto(UUID id, String name, String slug) {}
}
