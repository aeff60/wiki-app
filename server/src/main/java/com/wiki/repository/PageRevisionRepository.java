package com.wiki.repository;

import com.wiki.entity.PageRevision;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PageRevisionRepository extends JpaRepository<PageRevision, UUID> {
    List<PageRevision> findByPageIdOrderByRevisionNumberDesc(UUID pageId);
    long countByPageId(UUID pageId);
    Optional<PageRevision> findByIdAndPageId(UUID id, UUID pageId);
}
