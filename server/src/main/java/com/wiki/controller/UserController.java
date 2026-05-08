package com.wiki.controller;

import com.wiki.dto.user.UserResponse;
import com.wiki.dto.user.UserUpdateRequest;
import com.wiki.exception.ApiException;
import com.wiki.security.AuthenticatedUser;
import com.wiki.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> list(@AuthenticationPrincipal AuthenticatedUser user) {
        requireAdmin(user);
        return ResponseEntity.ok(userService.listUsers());
    }

    @PutMapping("/{userId}")
    public ResponseEntity<UserResponse> update(@PathVariable UUID userId,
                                                @Valid @RequestBody UserUpdateRequest req,
                                                @AuthenticationPrincipal AuthenticatedUser user) {
        requireAdmin(user);
        return ResponseEntity.ok(userService.updateUser(userId, req));
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> delete(@PathVariable UUID userId,
                                        @AuthenticationPrincipal AuthenticatedUser user) {
        requireAdmin(user);
        userService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }

    private void requireAdmin(AuthenticatedUser user) {
        if (!"admin".equals(user.getRole())) {
            throw new ApiException(403, "Admin access required");
        }
    }
}
