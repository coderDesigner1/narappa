package com.blog.artist.artist.controller;

import com.blog.artist.artist.entity.GuestbookEntry;
import com.blog.artist.artist.repository.GuestbookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/guestbook")
@CrossOrigin(origins = "http://localhost:3000")
public class GuestbookController {

    @Autowired
    private GuestbookRepository guestbookRepository;

    // ── Public ────────────────────────────────────────────────────────────────

    /** GET /api/guestbook — all entries ordered newest first */
    @GetMapping
    public List<GuestbookEntry> getAll() {
        return guestbookRepository.findAllByOrderByCreatedAtDesc();
    }

    /** POST /api/guestbook — submit a new entry or reply */
    @PostMapping
    public ResponseEntity<GuestbookEntry> create(@RequestBody GuestbookEntry entry) {
        entry.setCreatedAt(LocalDateTime.now());
        return ResponseEntity.ok(guestbookRepository.save(entry));
    }

    // ── Admin ─────────────────────────────────────────────────────────────────

    /**
     * PUT /api/guestbook/{id}
     * Edit name and message of an existing entry (admin only).
     */
    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<GuestbookEntry> update(
            @PathVariable Long id,
            @RequestBody GuestbookEntry details) {

        return guestbookRepository.findById(id)
                .map(existing -> {
                    existing.setName(details.getName());
                    existing.setMessage(details.getMessage());
                    return ResponseEntity.ok(guestbookRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * DELETE /api/guestbook/{id}
     * Deletes the entry AND all its replies (admin only).
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        return guestbookRepository.findById(id)
                .map(existing -> {
                    // Delete all child replies first
                    List<GuestbookEntry> replies = guestbookRepository.findByParentId(id);
                    guestbookRepository.deleteAll(replies);
                    // Then delete the parent
                    guestbookRepository.delete(existing);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}