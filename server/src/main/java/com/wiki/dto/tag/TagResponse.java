package com.wiki.dto.tag;

import java.util.UUID;

public record TagResponse(UUID id, String name, String slug) {}
