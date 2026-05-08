package com.wiki.dto.comment;

import jakarta.validation.constraints.NotBlank;
import java.util.UUID;

public record CommentRequest(
        @NotBlank String content,
        UUID parentId
) {}
