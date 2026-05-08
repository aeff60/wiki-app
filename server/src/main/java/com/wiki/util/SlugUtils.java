package com.wiki.util;

import java.util.function.Function;

public class SlugUtils {

    public static String slugify(String text) {
        if (text == null) return "";
        return text.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("[\\s]+", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");
    }

    public static String uniqueSlug(String base, Function<String, Boolean> existsCheck) {
        String slug = slugify(base);
        String candidate = slug;
        int n = 2;
        while (existsCheck.apply(candidate)) {
            candidate = slug + "-" + n++;
        }
        return candidate;
    }
}
