package com.wiki.dto.space;

import jakarta.validation.constraints.NotBlank;

public record SpaceRequest(
        @NotBlank String name,
        String description,
        Boolean isPublic
) {}
