package com.wiki.service;

import com.wiki.dto.space.SpaceRequest;
import com.wiki.dto.space.SpaceResponse;
import com.wiki.entity.Space;
import com.wiki.entity.User;
import com.wiki.exception.ApiException;
import com.wiki.repository.SpaceRepository;
import com.wiki.repository.UserRepository;
import com.wiki.security.AuthenticatedUser;
import com.wiki.util.SlugUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class SpaceService {

    private final SpaceRepository spaceRepository;
    private final UserRepository userRepository;

    public SpaceService(SpaceRepository spaceRepository, UserRepository userRepository) {
        this.spaceRepository = spaceRepository;
        this.userRepository = userRepository;
    }

    public List<SpaceResponse> listSpaces(AuthenticatedUser currentUser) {
        List<Space> spaces;
        if ("admin".equals(currentUser.getRole())) {
            spaces = spaceRepository.findAll();
        } else {
            spaces = spaceRepository.findAccessibleByUser(currentUser.getId());
        }
        return spaces.stream().map(this::toResponse).toList();
    }

    public SpaceResponse getSpace(UUID spaceId, AuthenticatedUser currentUser) {
        Space space = spaceRepository.findById(spaceId)
                .orElseThrow(() -> new ApiException(404, "Space not found"));
        checkAccess(space, currentUser);
        return toResponse(space);
    }

    @Transactional
    public SpaceResponse createSpace(SpaceRequest req, AuthenticatedUser currentUser) {
        User creator = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ApiException(404, "User not found"));
        Space space = new Space();
        space.setName(req.name());
        String slug = SlugUtils.uniqueSlug(req.name(), s -> spaceRepository.existsBySlug(s));
        space.setSlug(slug);
        space.setDescription(req.description());
        space.setPublic(req.isPublic() != null && req.isPublic());
        space.setCreatedBy(creator);
        space = spaceRepository.save(space);
        return toResponse(space);
    }

    @Transactional
    public SpaceResponse updateSpace(UUID spaceId, SpaceRequest req, AuthenticatedUser currentUser) {
        Space space = spaceRepository.findById(spaceId)
                .orElseThrow(() -> new ApiException(404, "Space not found"));
        space.setName(req.name());
        if (req.description() != null) space.setDescription(req.description());
        if (req.isPublic() != null) space.setPublic(req.isPublic());
        space = spaceRepository.save(space);
        return toResponse(space);
    }

    @Transactional
    public void deleteSpace(UUID spaceId) {
        Space space = spaceRepository.findById(spaceId)
                .orElseThrow(() -> new ApiException(404, "Space not found"));
        spaceRepository.delete(space);
    }

    private void checkAccess(Space space, AuthenticatedUser user) {
        if ("admin".equals(user.getRole())) return;
        if (space.isPublic()) return;
        if (space.getCreatedBy() != null && space.getCreatedBy().getId().equals(user.getId())) return;
        throw new ApiException(403, "Access denied");
    }

    private SpaceResponse toResponse(Space space) {
        return new SpaceResponse(
                space.getId(),
                space.getName(),
                space.getSlug(),
                space.getDescription(),
                space.isPublic(),
                space.getCreatedBy() != null ? space.getCreatedBy().getId() : null,
                space.getCreatedAt(),
                space.getUpdatedAt()
        );
    }
}
