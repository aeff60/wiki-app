package com.wiki.service;

import com.wiki.dto.auth.AuthResponse;
import com.wiki.dto.auth.LoginRequest;
import com.wiki.dto.auth.RegisterRequest;
import com.wiki.entity.User;
import com.wiki.exception.ApiException;
import com.wiki.repository.UserRepository;
import com.wiki.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.email())) {
            throw new ApiException(409, "Email already in use");
        }
        User user = new User();
        user.setEmail(req.email());
        user.setPasswordHash(passwordEncoder.encode(req.password()));
        user.setName(req.name());
        user.setRole("viewer");
        user = userRepository.save(user);
        String token = jwtTokenProvider.createToken(user.getId(), user.getRole());
        return toAuthResponse(token, user);
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.email())
                .orElseThrow(() -> new ApiException(401, "Invalid credentials"));
        if (!user.isActive()) {
            throw new ApiException(401, "Account is deactivated");
        }
        if (!passwordEncoder.matches(req.password(), user.getPasswordHash())) {
            throw new ApiException(401, "Invalid credentials");
        }
        String token = jwtTokenProvider.createToken(user.getId(), user.getRole());
        return toAuthResponse(token, user);
    }

    public AuthResponse.UserDto getMe(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(404, "User not found"));
        return toUserDto(user);
    }

    private AuthResponse toAuthResponse(String token, User user) {
        return new AuthResponse(token, toUserDto(user));
    }

    private AuthResponse.UserDto toUserDto(User user) {
        return new AuthResponse.UserDto(
                user.getId(), user.getEmail(), user.getName(), user.getRole(),
                user.getAvatarUrl(), user.getCreatedAt()
        );
    }
}
