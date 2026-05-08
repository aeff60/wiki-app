package com.wiki.dto.page;

import jakarta.validation.constraints.NotBlank;
import java.util.List;
import java.util.UUID;

public record PageRequest(
        @NotBlank String title,
        String content,
        UUID parentId,
        Boolean isPublished,
        List<String> tags,
        String changeSummary
) {}
