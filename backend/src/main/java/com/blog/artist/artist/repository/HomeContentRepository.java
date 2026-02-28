package com.blog.artist.artist.repository;

import com.blog.artist.artist.entity.HomeContent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface HomeContentRepository extends JpaRepository<HomeContent, Long> {

    /**
     * Find home content by language flag (E, T, or H).
     * Returns Optional so the controller can fall back to English if not found.
     */
    Optional<HomeContent> findByLanguage(String language);
}