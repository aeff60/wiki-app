package com.wiki.service;

import com.wiki.dto.tag.TagRequest;
import com.wiki.dto.tag.TagResponse;
import com.wiki.entity.Tag;
import com.wiki.exception.ApiException;
import com.wiki.repository.TagRepository;
import com.wiki.util.SlugUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TagService {

    private final TagRepository tagRepository;

    public TagService(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }

    public List<TagResponse> listTags() {
        return tagRepository.findAll().stream()
                .map(t -> new TagResponse(t.getId(), t.getName(), t.getSlug()))
                .toList();
    }

    @Transactional
    public TagResponse createTag(TagRequest req) {
        String slug = SlugUtils.slugify(req.name());
        if (tagRepository.existsBySlug(slug)) {
            throw new ApiException(409, "Tag already exists");
        }
        Tag tag = new Tag();
        tag.setName(req.name());
        tag.setSlug(slug);
        tag = tagRepository.save(tag);
        return new TagResponse(tag.getId(), tag.getName(), tag.getSlug());
    }
}
