package com.wiki.controller;

import com.wiki.dto.upload.UploadResponse;
import com.wiki.exception.ApiException;
import com.wiki.security.AuthenticatedUser;
import com.wiki.service.UploadService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/uploads")
public class UploadController {

    private final UploadService uploadService;

    public UploadController(UploadService uploadService) {
        this.uploadService = uploadService;
    }

    @PostMapping
    public ResponseEntity<UploadResponse> upload(@RequestParam("file") MultipartFile file,
                                                   @AuthenticationPrincipal AuthenticatedUser user) {
        requireRole(user, "editor");
        return ResponseEntity.status(201).body(uploadService.upload(file, user));
    }

    private void requireRole(AuthenticatedUser user, String minRole) {
        int required = roleLevel(minRole);
        int actual = roleLevel(user.getRole());
        if (actual < required) throw new ApiException(403, "Insufficient permissions");
    }

    private int roleLevel(String role) {
        return switch (role) {
            case "admin" -> 3;
            case "editor" -> 2;
            default -> 1;
        };
    }
}
