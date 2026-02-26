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

    /** Return every row ordered so React can group by page number. */
    @GetMapping
    public List<BioParagraph> getAll() {
        return bioParagraphRepository.findAllByOrderByPageAscOrderNumAsc();
    }

    /** Distinct page numbers – used by the admin page-selector dropdown. */
    @GetMapping("/pages")
    public List<Integer> getDistinctPages() {
        return bioParagraphRepository.findDistinctPages();
    }

    /** All rows for one page – used by the admin editor when a page is selected. */
    @GetMapping("/page/{page}")
    public List<BioParagraph> getByPage(@PathVariable Integer page) {
        return bioParagraphRepository.findByPageOrderByOrderNumAsc(page);
    }

    // ── Admin ─────────────────────────────────────────────────────────────────

    /** Create a single row. */
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public BioParagraph create(@RequestBody BioParagraph item) {
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
    @PutMapping("/page/{page}/bulk")
    @PreAuthorize("isAuthenticated()")
    @Transactional
    public List<BioParagraph> bulkSave(
            @PathVariable Integer page,
            @RequestBody List<BioParagraph> items) {

        bioParagraphRepository.deleteAllByPage(page);
        bioParagraphRepository.flush();

        // Ensure every item carries the correct page number
        items.forEach(item -> {
            item.setId(null);   // force INSERT
            item.setPage(page);
        });

        return bioParagraphRepository.saveAll(items);
    }

    @DeleteMapping("/page/{page}")
@PreAuthorize("isAuthenticated()")
@Transactional
public ResponseEntity<?> deletePage(@PathVariable Integer page) {
    bioParagraphRepository.deleteAllByPage(page);
    return ResponseEntity.ok().build();
}   
}