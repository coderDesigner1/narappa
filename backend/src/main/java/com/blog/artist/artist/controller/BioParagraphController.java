package com.blog.artist.artist.controller;

import com.blog.artist.artist.entity.BioParagraph;
import com.blog.artist.artist.repository.BioParagraphRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bio-paragraphs")
@CrossOrigin(origins = "http://localhost:3000")
public class BioParagraphController {

    @Autowired
    private BioParagraphRepository bioParagraphRepository;

    // ── Public ────────────────────────────────────────────────────────────────

    /**
     * Return rows ordered for React grouping.
     * If ?lang=E/T/H is supplied, only rows matching that language are returned.
     * If omitted, defaults to English ("E") for backward compatibility.
     */
    @GetMapping
    public List<BioParagraph> getAll(
            @RequestParam(value = "lang", defaultValue = "E") String lang) {
        return bioParagraphRepository.findByLanguageOrderByPageAscOrderNumAsc(lang);
    }

    /** Distinct page numbers for a given language – used by the admin page-selector dropdown. */
    @GetMapping("/pages")
    public List<Integer> getDistinctPages(
            @RequestParam(value = "lang", defaultValue = "E") String lang) {
        return bioParagraphRepository.findDistinctPagesByLanguage(lang);
    }

    /** All rows for one page + language – used by the admin editor when a page is selected. */
    @GetMapping("/page/{page}")
    public List<BioParagraph> getByPage(
            @PathVariable Integer page,
            @RequestParam(value = "lang", defaultValue = "E") String lang) {
        return bioParagraphRepository.findByPageAndLanguageOrderByOrderNumAsc(page, lang);
    }

    // ── Admin ─────────────────────────────────────────────────────────────────

    /** Create a single row. The request body must include a "language" field (E/T/H). */
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public BioParagraph create(@RequestBody BioParagraph item) {
        if (item.getLanguage() == null || item.getLanguage().isBlank()) {
            item.setLanguage("E"); // default to English
        }
        return bioParagraphRepository.save(item);
    }

    /** Update a single row. */
    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BioParagraph> update(
            @PathVariable Long id,
            @RequestBody BioParagraph details) {
        return bioParagraphRepository.findById(id)
                .map(existing -> {
                    existing.setParagraph(details.getParagraph());
                    existing.setPage(details.getPage());
                    existing.setOrderNum(details.getOrderNum());
                    existing.setHeader(details.getHeader());
                    existing.setLanguage(details.getLanguage() != null ? details.getLanguage() : "E");
                    return ResponseEntity.ok(bioParagraphRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /** Delete a single row. */
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        return bioParagraphRepository.findById(id)
                .map(existing -> {
                    bioParagraphRepository.delete(existing);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Bulk-save: replaces ALL rows for a given page with the supplied list.
     * The admin editor sends the full page state on every save, so we delete
     * the old rows and insert the new ones in one transaction.
     */
    /**
     * Bulk-save: replaces ALL rows for a given page + language with the supplied list.
     * URL: PUT /api/bio-paragraphs/page/{page}/bulk?lang=E
     */
    @PutMapping("/page/{page}/bulk")
    @PreAuthorize("isAuthenticated()")
    @Transactional
    public List<BioParagraph> bulkSave(
            @PathVariable Integer page,
            @RequestParam(value = "lang", defaultValue = "E") String lang,
            @RequestBody List<BioParagraph> items) {

        bioParagraphRepository.deleteAllByPageAndLanguage(page, lang);
        bioParagraphRepository.flush();

        // Ensure every item carries the correct page number and language
        items.forEach(item -> {
            item.setId(null);       // force INSERT
            item.setPage(page);
            item.setLanguage(lang);
        });

        return bioParagraphRepository.saveAll(items);
    }

    @DeleteMapping("/page/{page}")
    @PreAuthorize("isAuthenticated()")
    @Transactional
    public ResponseEntity<?> deletePage(
            @PathVariable Integer page,
            @RequestParam(value = "lang", defaultValue = "E") String lang) {
        bioParagraphRepository.deleteAllByPageAndLanguage(page, lang);
        return ResponseEntity.ok().build();
    }   
}