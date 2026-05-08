package com.wiki.service;

import com.wiki.dto.upload.UploadResponse;
import com.wiki.entity.Upload;
import com.wiki.exception.ApiException;
import com.wiki.repository.UploadRepository;
import com.wiki.security.AuthenticatedUser;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Set;
import java.util.UUID;

@Service
public class UploadService {

    private static final Set<String> ALLOWED_TYPES = Set.of(
            "image/jpeg", "image/png", "image/gif", "image/webp",
            "image/svg+xml", "application/pdf"
    );

    @Value("${upload.dir}")
    private String uploadDir;

    private final UploadRepository uploadRepository;

    public UploadService(UploadRepository uploadRepository) {
        this.uploadRepository = uploadRepository;
    }

    public UploadResponse upload(MultipartFile file, AuthenticatedUser currentUser) {
        if (file == null || file.isEmpty()) {
            throw new ApiException(400, "No file provided");
        }
        String contentType = file.getContentType();
        if (!ALLOWED_TYPES.contains(contentType)) {
            throw new ApiException(400, "File type not allowed");
        }
        if (file.getSize() > 10 * 1024 * 1024) {
            throw new ApiException(400, "File too large (max 10MB)");
        }

        String originalName = file.getOriginalFilename();
        String extension = "";
        if (originalName != null && originalName.contains(".")) {
            extension = originalName.substring(originalName.lastIndexOf("."));
        }
        String filename = UUID.randomUUID() + extension;

        try {
            Path dir = Paths.get(uploadDir);
            Files.createDirectories(dir);
            Path dest = dir.resolve(filename);
            file.transferTo(dest.toFile());
        } catch (IOException e) {
            throw new ApiException(500, "Failed to save file");
        }

        String url = "/uploads/" + filename;

        Upload upload = new Upload();
        upload.setFilename(filename);
        upload.setOriginalName(originalName != null ? originalName : filename);
        upload.setMimeType(contentType);
        upload.setSizeBytes(file.getSize());
        upload.setUrl(url);
        upload.setUploadedBy(currentUser.getId());
        uploadRepository.save(upload);

        return new UploadResponse(url, filename, upload.getOriginalName(), contentType, file.getSize());
    }
}
