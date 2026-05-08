package com.wiki.controller;

import com.wiki.dto.page.PageRequest;
import com.wiki.dto.page.PageResponse;
import com.wiki.dto.revision.RevisionResponse;
import com.wiki.exception.ApiException;
import com.wiki.security.AuthenticatedUser;
import com.wiki.service.PageService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/spaces/{spaceId}/pages")
public class PageController {

    private final PageService pageService;

    public PageController(PageService pageService) {
        this.pageService = pageService;
    }

    @GetMapping
    public ResponseEntity<List<PageResponse>> list(@PathVariable UUID spaceId) {
        return ResponseEntity.ok(pageService.listPages(spaceId));
    }

    @PostMapping
    public ResponseEntity<PageResponse> create(@PathVariable UUID spaceId,
                                                @Valid @RequestBody PageRequest req,
                                                @AuthenticationPrincipal AuthenticatedUser user) {
        requireRole(user, "editor");
        return ResponseEntity.status(201).body(pageService.createPage(spaceId, req, user));
    }

    @GetMapping("/{pageId}")
    public ResponseEntity<PageResponse> get(@PathVariable UUID spaceId, @PathVariable UUID pageId) {
        return ResponseEntity.ok(pageService.getPage(spaceId, pageId));
    }

    @PutMapping("/{pageId}")
    public ResponseEntity<PageResponse> update(@PathVariable UUID spaceId, @PathVariable UUID pageId,
                                                @Valid @RequestBody PageRequest req,
                                                @AuthenticationPrincipal AuthenticatedUser user) {
        requireRole(user, "editor");
        return ResponseEntity.ok(pageService.updatePage(spaceId, pageId, req, user));
    }

    @DeleteMapping("/{pageId}")
    public ResponseEntity<Void> delete(@PathVariable UUID spaceId, @PathVariable UUID pageId,
                                        @AuthenticationPrincipal AuthenticatedUser user) {
        requireRole(user, "editor");
        pageService.deletePage(spaceId, pageId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{pageId}/revisions")
    public ResponseEntity<List<RevisionResponse>> revisions(@PathVariable UUID spaceId,
                                                             @PathVariable UUID pageId) {
        return ResponseEntity.ok(pageService.getRevisions(spaceId, pageId));
    }

    @GetMapping("/{pageId}/revisions/{revisionId}")
    public ResponseEntity<RevisionResponse> revision(@PathVariable UUID spaceId,
                                                      @PathVariable UUID pageId,
                                                      @PathVariable UUID revisionId) {
        return ResponseEntity.ok(pageService.getRevision(spaceId, pageId, revisionId));
    }

    @PostMapping("/{pageId}/revisions/{revisionId}/restore")
    public ResponseEntity<PageResponse> restore(@PathVariable UUID spaceId,
                                                  @PathVariable UUID pageId,
                                                  @PathVariable UUID revisionId,
                                                  @AuthenticationPrincipal AuthenticatedUser user) {
        requireRole(user, "editor");
        return ResponseEntity.ok(pageService.restoreRevision(spaceId, pageId, revisionId, user));
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
