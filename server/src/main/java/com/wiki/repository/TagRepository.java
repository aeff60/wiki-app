package com.wiki.repository;

import com.wiki.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface TagRepository extends JpaRepository<Tag, UUID> {
    Optional<Tag> findBySlug(String slug);
    Optional<Tag> findByName(String name);
    boolean existsBySlug(String slug);
    boolean existsByName(String name);
}
