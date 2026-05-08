package com.wiki.dto.auth;

import java.time.OffsetDateTime;
import java.util.UUID;

public record AuthResponse(
        String token,
        UserDto user
) {
    public record UserDto(
            UUID id,
            String email,
            String name,
            String role,
            String avatarUrl,
            OffsetDateTime createdAt
    ) {}
}
