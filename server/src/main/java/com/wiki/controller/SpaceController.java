package com.wiki.controller;

import com.wiki.dto.space.SpaceRequest;
import com.wiki.dto.space.SpaceResponse;
import com.wiki.exception.ApiException;
import com.wiki.security.AuthenticatedUser;
import com.wiki.service.SpaceService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/spaces")
public class SpaceController {

    private final SpaceService spaceService;

    public SpaceController(SpaceService spaceService) {
        this.spaceService = spaceService;
    }

    @GetMapping
    public ResponseEntity<List<SpaceResponse>> list(@AuthenticationPrincipal AuthenticatedUser user) {
        return ResponseEntity.ok(spaceService.listSpaces(user));
    }

    @GetMapping("/{spaceId}")
    public ResponseEntity<SpaceResponse> get(@PathVariable UUID spaceId,
                                              @AuthenticationPrincipal AuthenticatedUser user) {
        return ResponseEntity.ok(spaceService.getSpace(spaceId, user));
    }

    @PostMapping
    public ResponseEntity<SpaceResponse> create(@Valid @RequestBody SpaceRequest req,
                                                  @AuthenticationPrincipal AuthenticatedUser user) {
        requireRole(user, "editor");
        return ResponseEntity.status(201).body(spaceService.createSpace(req, user));
    }

    @PutMapping("/{spaceId}")
    public ResponseEntity<SpaceResponse> update(@PathVariable UUID spaceId,
                                                  @Valid @RequestBody SpaceRequest req,
                                                  @AuthenticationPrincipal AuthenticatedUser user) {
        requireRole(user, "editor");
        return ResponseEntity.ok(spaceService.updateSpace(spaceId, req, user));
    }

    @DeleteMapping("/{spaceId}")
    public ResponseEntity<Void> delete(@PathVariable UUID spaceId,
                                        @AuthenticationPrincipal AuthenticatedUser user) {
        requireRole(user, "admin");
        spaceService.deleteSpace(spaceId);
        return ResponseEntity.noContent().build();
    }

    private void requireRole(AuthenticatedUser user, String minRole) {
        int required = roleLevel(minRole);
        int actual = roleLevel(user.getRole());
        if (actual < required) {
            throw new ApiException(403, "Insufficient permissions");
        }
    }

    private int roleLevel(String role) {
        return switch (role) {
            case "admin" -> 3;
            case "editor" -> 2;
            default -> 1;
        };
    }
}
