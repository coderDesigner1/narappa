package com.blog.artist.artist.repository;

import com.blog.artist.artist.entity.BioParagraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface BioParagraphRepository extends JpaRepository<BioParagraph, Long> {

    // ── Public BioPage ────────────────────────────────────────────────────────

    // All rows for a given language, ordered for React grouping
    List<BioParagraph> findByLanguageOrderByPageAscOrderNumAsc(String language);

    // ── Admin editor ──────────────────────────────────────────────────────────

    // Rows for a specific page + language (used when admin selects a page)
    List<BioParagraph> findByPageAndLanguageOrderByOrderNumAsc(Integer page, String language);

    // Distinct page numbers for a given language (populates admin page-selector dropdown)
    @Query("SELECT DISTINCT b.page FROM BioParagraph b WHERE b.language = :language ORDER BY b.page ASC")
    List<Integer> findDistinctPagesByLanguage(String language);

    // ── Bulk / Delete ─────────────────────────────────────────────────────────

    // Delete all rows for a page + language before re-inserting (bulk save & delete page)
    void deleteAllByPageAndLanguage(Integer page, String language);

}