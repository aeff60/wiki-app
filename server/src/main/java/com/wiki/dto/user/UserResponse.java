package com.wiki.dto.user;

import java.time.OffsetDateTime;
import java.util.UUID;

public record UserResponse(
        UUID id,
        String email,
        String name,
        String role,
        String avatarUrl,
        boolean isActive,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {}
