package com.wiki.dto.tag;

import jakarta.validation.constraints.NotBlank;

public record TagRequest(@NotBlank String name) {}
