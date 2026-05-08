package com.wiki.controller;

import com.wiki.dto.auth.AuthResponse;
import com.wiki.dto.auth.LoginRequest;
import com.wiki.dto.auth.RegisterRequest;
import com.wiki.security.AuthenticatedUser;
import com.wiki.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest req) {
        return ResponseEntity.status(201).body(authService.register(req));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }

    @GetMapping("/me")
    public ResponseEntity<AuthResponse.UserDto> me(@AuthenticationPrincipal AuthenticatedUser user) {
        return ResponseEntity.ok(authService.getMe(user.getId()));
    }
}
