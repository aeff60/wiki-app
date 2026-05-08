package com.wiki.repository;

import com.wiki.entity.Space;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SpaceRepository extends JpaRepository<Space, UUID> {
    Optional<Space> findBySlug(String slug);
    boolean existsBySlug(String slug);

    @Query("SELECT s FROM Space s WHERE s.isPublic = true OR s.createdBy.id = :userId")
    List<Space> findAccessibleByUser(@Param("userId") UUID userId);
}
