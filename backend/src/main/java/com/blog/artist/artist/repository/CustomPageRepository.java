package com.blog.artist.artist.repository;

import com.blog.artist.artist.entity.CustomPage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface CustomPageRepository extends JpaRepository<CustomPage, Long> {

    // ── Public endpoints ──────────────────────────────────────────────────────

    // All published pages for a given language
    List<CustomPage> findByPublishedTrueAndLanguageOrderByYearDescMonthDesc(String language);

    // Pages by year + month + language
    List<CustomPage> findByYearAndMonthAndLanguageOrderByCreatedAtDesc(Integer year, Integer month, String language);

    // Pages by year + language
    List<CustomPage> findByYearAndLanguageOrderByMonthDesc(Integer year, String language);

    // Distinct years that have at least one page for the given language
    @Query("SELECT DISTINCT p.year FROM CustomPage p WHERE p.language = :language ORDER BY p.year DESC")
    List<Integer> findDistinctYearsByLanguage(String language);

    // ── Admin endpoints (no language filter — admin sees all) ─────────────────

    // Admin needs to see all pages regardless of language (findAll() from JpaRepository is used)
}