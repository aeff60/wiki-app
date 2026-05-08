package com.wiki.service;

import com.wiki.dto.page.PageRequest;
import com.wiki.dto.page.PageResponse;
import com.wiki.dto.revision.RevisionResponse;
import com.wiki.entity.*;
import com.wiki.exception.ApiException;
import com.wiki.repository.*;
import com.wiki.security.AuthenticatedUser;
import com.wiki.util.SlugUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class PageService {

    private final PageRepository pageRepository;
    private final PageRevisionRepository revisionRepository;
    private final SpaceRepository spaceRepository;
    private final UserRepository userRepository;
    private final TagRepository tagRepository;

    public PageService(PageRepository pageRepository, PageRevisionRepository revisionRepository,
                       SpaceRepository spaceRepository, UserRepository userRepository,
                       TagRepository tagRepository) {
        this.pageRepository = pageRepository;
        this.revisionRepository = revisionRepository;
        this.spaceRepository = spaceRepository;
        this.userRepository = userRepository;
        this.tagRepository = tagRepository;
    }

    public List<PageResponse> listPages(UUID spaceId) {
        spaceRepository.findById(spaceId)
                .orElseThrow(() -> new ApiException(404, "Space not found"));
        List<Page> pages = pageRepository.findBySpaceId(spaceId);
        return buildTree(pages, null);
    }

    @Transactional
    public PageResponse createPage(UUID spaceId, PageRequest req, AuthenticatedUser currentUser) {
        Space space = spaceRepository.findById(spaceId)
                .orElseThrow(() -> new ApiException(404, "Space not found"));
        User author = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ApiException(404, "User not found"));

        Page page = new Page();
        page.setSpace(space);
        page.setTitle(req.title());
        page.setContent(req.content() != null ? req.content() : "");
        page.setAuthor(author);
        page.setPublished(req.isPublished() != null && req.isPublished());
        page.setParentId(req.parentId());

        String slug = SlugUtils.uniqueSlug(req.title(),
                s -> pageRepository.existsBySpaceIdAndSlug(spaceId, s));
        page.setSlug(slug);

        List<Tag> tags = resolveTags(req.tags());
        page.setTags(tags);

        page = pageRepository.save(page);

        saveRevision(page, author, req.changeSummary());

        return toResponse(page, null);
    }

    public PageResponse getPage(UUID spaceId, UUID pageId) {
        Page page = pageRepository.findByIdAndSpaceId(pageId, spaceId)
                .orElseThrow(() -> new ApiException(404, "Page not found"));
        // increment view count
        page.setViewCount(page.getViewCount() + 1);
        pageRepository.save(page);
        Page withTags = pageRepository.findByIdWithTags(pageId).orElse(page);
        return toResponse(withTags, null);
    }

    @Transactional
    public PageResponse updatePage(UUID spaceId, UUID pageId, PageRequest req, AuthenticatedUser currentUser) {
        Page page = pageRepository.findByIdAndSpaceId(pageId, spaceId)
                .orElseThrow(() -> new ApiException(404, "Page not found"));
        User author = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ApiException(404, "User not found"));

        page.setTitle(req.title());
        page.setContent(req.content() != null ? req.content() : "");
        if (req.isPublished() != null) page.setPublished(req.isPublished());
        if (req.parentId() != null) page.setParentId(req.parentId());

        List<Tag> tags = resolveTags(req.tags());
        page.getTags().clear();
        page.getTags().addAll(tags);

        page = pageRepository.save(page);
        saveRevision(page, author, req.changeSummary());

        return toResponse(page, null);
    }

    @Transactional
    public void deletePage(UUID spaceId, UUID pageId) {
        Page page = pageRepository.findByIdAndSpaceId(pageId, spaceId)
                .orElseThrow(() -> new ApiException(404, "Page not found"));
        pageRepository.delete(page);
    }

    public List<RevisionResponse> getRevisions(UUID spaceId, UUID pageId) {
        pageRepository.findByIdAndSpaceId(pageId, spaceId)
                .orElseThrow(() -> new ApiException(404, "Page not found"));
        List<PageRevision> revisions = revisionRepository.findByPageIdOrderByRevisionNumberDesc(pageId);
        return revisions.stream().map(r -> toRevisionResponse(r, null)).toList();
    }

    public RevisionResponse getRevision(UUID spaceId, UUID pageId, UUID revisionId) {
        pageRepository.findByIdAndSpaceId(pageId, spaceId)
                .orElseThrow(() -> new ApiException(404, "Page not found"));
        PageRevision revision = revisionRepository.findByIdAndPageId(revisionId, pageId)
                .orElseThrow(() -> new ApiException(404, "Revision not found"));
        return toRevisionResponse(revision, null);
    }

    @Transactional
    public PageResponse restoreRevision(UUID spaceId, UUID pageId, UUID revisionId, AuthenticatedUser currentUser) {
        Page page = pageRepository.findByIdAndSpaceId(pageId, spaceId)
                .orElseThrow(() -> new ApiException(404, "Page not found"));
        PageRevision revision = revisionRepository.findByIdAndPageId(revisionId, pageId)
                .orElseThrow(() -> new ApiException(404, "Revision not found"));
        User author = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ApiException(404, "User not found"));

        page.setTitle(revision.getTitle());
        page.setContent(revision.getContent());
        page = pageRepository.save(page);
        saveRevision(page, author, "Restored from revision " + revision.getRevisionNumber());

        return toResponse(page, null);
    }

    private List<Tag> resolveTags(List<String> tagNames) {
        if (tagNames == null || tagNames.isEmpty()) return new ArrayList<>();
        List<Tag> result = new ArrayList<>();
        for (String name : tagNames) {
            String slug = SlugUtils.slugify(name);
            Tag tag = tagRepository.findBySlug(slug).orElseGet(() -> {
                Tag t = new Tag();
                t.setName(name);
                t.setSlug(slug);
                return tagRepository.save(t);
            });
            result.add(tag);
        }
        return result;
    }

    private void saveRevision(Page page, User author, String changeSummary) {
        long count = revisionRepository.countByPageId(page.getId());
        PageRevision revision = new PageRevision();
        revision.setPageId(page.getId());
        revision.setTitle(page.getTitle());
        revision.setContent(page.getContent());
        revision.setAuthorId(author.getId());
        revision.setRevisionNumber((int) count + 1);
        revision.setChangeSummary(changeSummary);
        revisionRepository.save(revision);
    }

    private List<PageResponse> buildTree(List<Page> pages, UUID parentId) {
        return pages.stream()
                .filter(p -> Objects.equals(p.getParentId(), parentId))
                .map(p -> toResponse(p, pages))
                .toList();
    }

    private PageResponse toResponse(Page page, List<Page> allPages) {
        List<PageResponse> children = allPages != null
                ? buildTree(allPages, page.getId())
                : List.of();

        List<PageResponse.TagDto> tagDtos = page.getTags().stream()
                .map(t -> new PageResponse.TagDto(t.getId(), t.getName(), t.getSlug()))
                .toList();

        return new PageResponse(
                page.getId(),
                page.getSpace().getId(),
                page.getParentId(),
                page.getTitle(),
                page.getSlug(),
                page.getContent(),
                page.getAuthor().getId(),
                page.getAuthor().getName(),
                page.isPublished(),
                page.getViewCount(),
                tagDtos,
                children,
                page.getCreatedAt(),
                page.getUpdatedAt()
        );
    }

    private RevisionResponse toRevisionResponse(PageRevision r, String authorName) {
        return new RevisionResponse(
                r.getId(), r.getPageId(), r.getTitle(), r.getContent(),
                r.getAuthorId(), authorName, r.getRevisionNumber(),
                r.getChangeSummary(), r.getCreatedAt()
        );
    }
}
