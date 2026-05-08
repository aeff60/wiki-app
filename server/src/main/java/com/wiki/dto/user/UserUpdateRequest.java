package com.wiki.dto.user;

public record UserUpdateRequest(
        String name,
        String role,
        Boolean isActive
) {}
