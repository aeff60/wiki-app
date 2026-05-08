package com.wiki.service;

import com.wiki.repository.SearchRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SearchService {

    private final SearchRepository searchRepository;

    public SearchService(SearchRepository searchRepository) {
        this.searchRepository = searchRepository;
    }

    public Map<String, Object> search(String q, String spaceId, int page, int limit) {
        int offset = (page - 1) * limit;
        List<Map<String, Object>> results = searchRepository.search(q, spaceId, limit, offset);
        long total = searchRepository.searchCount(q, spaceId);
        Map<String, Object> response = new HashMap<>();
        response.put("results", results);
        response.put("total", total);
        response.put("page", page);
        response.put("limit", limit);
        response.put("pages", (int) Math.ceil((double) total / limit));
        return response;
    }
}
