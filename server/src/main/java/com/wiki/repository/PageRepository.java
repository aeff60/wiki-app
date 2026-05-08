package com.wiki.repository;

import com.wiki.entity.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PageRepository extends JpaRepository<Page, UUID> {
    List<Page> findBySpaceId(UUID spaceId);
    Optional<Page> findByIdAndSpaceId(UUID id, UUID spaceId);
    boolean existsBySpaceIdAndSlug(UUID spaceId, String slug);

    @Query("SELECT p FROM Page p LEFT JOIN FETCH p.tags WHERE p.id = :id")
    Optional<Page> findByIdWithTags(@Param("id") UUID id);
}
