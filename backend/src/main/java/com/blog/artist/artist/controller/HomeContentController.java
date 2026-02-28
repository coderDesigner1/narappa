package com.blog.artist.artist.controller;

import com.blog.artist.artist.entity.HomeContent;
import com.blog.artist.artist.repository.HomeContentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/home-content")
@CrossOrigin(origins = "http://localhost:3000")
public class HomeContentController {

    @Autowired
    private HomeContentRepository homeContentRepository;

    // ── Public ────────────────────────────────────────────────────────────────

    /**
     * GET /api/home-content?lang=E
     * Returns the poem, quote, and bio button label for the requested language.
     * Falls back to English ("E") if the requested language has no entry.
     */
    @GetMapping
    public ResponseEntity<HomeContent> getByLanguage(
            @RequestParam(value = "lang", defaultValue = "E") String lang) {

        HomeContent content = homeContentRepository.findByLanguage(lang)
                .orElseGet(() -> homeContentRepository.findByLanguage("E")
                        .orElse(null));

        if (content == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(content);
    }

    // ── Admin ─────────────────────────────────────────────────────────────────

    /** GET /api/home-content/all — returns all language entries (admin use) */
    @GetMapping("/all")
    @PreAuthorize("isAuthenticated()")
    public List<HomeContent> getAll() {
        return homeContentRepository.findAll();
    }

    /**
     * POST /api/home-content
     * Create a new language entry. The request body must include "language", "poem", "quote".
     */
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<HomeContent> create(@RequestBody HomeContent content) {
        if (content.getLanguage() == null || content.getLanguage().isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        // Prevent duplicate language entries
        if (homeContentRepository.findByLanguage(content.getLanguage()).isPresent()) {
            return ResponseEntity.status(409).build(); // 409 Conflict
        }
        return ResponseEntity.ok(homeContentRepository.save(content));
    }

    /**
     * PUT /api/home-content/{id}
     * Update poem, quote, and bio button label for an existing entry.
     */
    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<HomeContent> update(
            @PathVariable Long id,
            @RequestBody HomeContent details) {

        return homeContentRepository.findById(id)
                .map(existing -> {
                    existing.setPoem(details.getPoem());
                    existing.setQuote(details.getQuote());
                    existing.setBioButton(details.getBioButton());
                    // Language flag is intentionally not updatable to avoid orphan records
                    return ResponseEntity.ok(homeContentRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * DELETE /api/home-content/{id}
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        return homeContentRepository.findById(id)
                .map(existing -> {
                    homeContentRepository.delete(existing);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}