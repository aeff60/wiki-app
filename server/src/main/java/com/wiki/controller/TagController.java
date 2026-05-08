package com.wiki.controller;

import com.wiki.dto.tag.TagRequest;
import com.wiki.dto.tag.TagResponse;
import com.wiki.exception.ApiException;
import com.wiki.security.AuthenticatedUser;
import com.wiki.service.TagService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
public class TagController {

    private final TagService tagService;

    public TagController(TagService tagService) {
        this.tagService = tagService;
    }

    @GetMapping
    public ResponseEntity<List<TagResponse>> list() {
        return ResponseEntity.ok(tagService.listTags());
    }

    @PostMapping
    public ResponseEntity<TagResponse> create(@Valid @RequestBody TagRequest req,
                                               @AuthenticationPrincipal AuthenticatedUser user) {
        requireRole(user, "editor");
        return ResponseEntity.status(201).body(tagService.createTag(req));
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
