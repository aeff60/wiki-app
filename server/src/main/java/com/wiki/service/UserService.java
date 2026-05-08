package com.wiki.service;

import com.wiki.dto.user.UserResponse;
import com.wiki.dto.user.UserUpdateRequest;
import com.wiki.entity.User;
import com.wiki.exception.ApiException;
import com.wiki.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<UserResponse> listUsers() {
        return userRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional
    public UserResponse updateUser(UUID userId, UserUpdateRequest req) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(404, "User not found"));
        if (req.name() != null) user.setName(req.name());
        if (req.role() != null) {
            if (!List.of("admin", "editor", "viewer").contains(req.role())) {
                throw new ApiException(400, "Invalid role");
            }
            user.setRole(req.role());
        }
        if (req.isActive() != null) user.setActive(req.isActive());
        user = userRepository.save(user);
        return toResponse(user);
    }

    @Transactional
    public void deleteUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(404, "User not found"));
        userRepository.delete(user);
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(), user.getEmail(), user.getName(), user.getRole(),
                user.getAvatarUrl(), user.isActive(), user.getCreatedAt(), user.getUpdatedAt()
        );
    }
}
