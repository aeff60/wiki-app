package com.wiki.dto.space;

import java.time.OffsetDateTime;
import java.util.UUID;

public record SpaceResponse(
        UUID id,
        String name,
        String slug,
        String description,
        boolean isPublic,
        UUID createdBy,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {}
