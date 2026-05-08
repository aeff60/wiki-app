package com.wiki.dto.upload;

public record UploadResponse(
        String url,
        String filename,
        String originalName,
        String mimeType,
        long sizeBytes
) {}
