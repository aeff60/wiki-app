package com.wiki.repository;

import com.wiki.entity.Page;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface SearchRepository extends Repository<Page, UUID> {

    @Query(nativeQuery = true, value = """
            SELECT p.id::text, p.title, p.slug, p.space_id::text, p.updated_at,
                   s.name AS space_name, s.slug AS space_slug,
                   u.name AS author_name,
                   ts_rank(p.search_vector, plainto_tsquery('english', :q)) AS rank,
                   ts_headline('english', p.content, plainto_tsquery('english', :q),
                     'MaxWords=35, MinWords=15, StartSel=<mark>, StopSel=</mark>, HighlightAll=FALSE'
                   ) AS excerpt
            FROM pages p
            JOIN spaces s ON s.id = p.space_id
            JOIN users u ON u.id = p.author_id
            WHERE p.search_vector @@ plainto_tsquery('english', :q)
              AND (:spaceId IS NULL OR p.space_id = CAST(:spaceId AS UUID))
              AND p.is_published = TRUE
            ORDER BY rank DESC
            LIMIT :limit OFFSET :offset
            """)
    List<Map<String, Object>> search(@Param("q") String q,
                                      @Param("spaceId") String spaceId,
                                      @Param("limit") int limit,
                                      @Param("offset") int offset);

    @Query(nativeQuery = true, value = """
            SELECT COUNT(*)
            FROM pages p
            WHERE p.search_vector @@ plainto_tsquery('english', :q)
              AND (:spaceId IS NULL OR p.space_id = CAST(:spaceId AS UUID))
              AND p.is_published = TRUE
            """)
    long searchCount(@Param("q") String q, @Param("spaceId") String spaceId);
}
