package com.blog.artist.artist.controller;

import com.blog.artist.artist.entity.CustomPage;
import com.blog.artist.artist.repository.CustomPageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/pages")
@CrossOrigin(origins = "http://narappa-frontend:3000")
public class CustomPageController {
    
    @Autowired
    private CustomPageRepository customPageRepository;
    
    // Public - Get all published pages
    @GetMapping("/published")
    public List<CustomPage> getPublishedPages() {
        return customPageRepository.findByPublishedTrueOrderByYearDescMonthDesc();
    }
    
    // Public - Get page by ID
    @GetMapping("/{id}")
    public ResponseEntity<CustomPage> getPage(@PathVariable Long id) {
        return customPageRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    // Public - Get years with pages
    @GetMapping("/years")
    public List<Integer> getYears() {
        return customPageRepository.findDistinctYears();
    }
    
    // Public - Get pages by year and month
    @GetMapping("/year/{year}/month/{month}")
    public List<CustomPage> getPagesByYearMonth(@PathVariable Integer year, @PathVariable Integer month) {
        return customPageRepository.findByYearAndMonthOrderByCreatedAtDesc(year, month);
    }
    
    // Public - Get pages by year
    @GetMapping("/year/{year}")
    public List<CustomPage> getPagesByYear(@PathVariable Integer year) {
        return customPageRepository.findByYearOrderByMonthDesc(year);
    }
    
    // Admin only - Get all pages
    @GetMapping("/admin/all")
    @PreAuthorize("isAuthenticated()")
    public List<CustomPage> getAllPages() {
        return customPageRepository.findAll();
    }
    
    // Admin only - Create page
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public CustomPage createPage(@RequestBody CustomPage page) {
        return customPageRepository.save(page);
    }
    
    // Admin only - Update page
    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CustomPage> updatePage(@PathVariable Long id, @RequestBody CustomPage pageDetails) {
        return customPageRepository.findById(id)
            .map(page -> {
                page.setTitle(pageDetails.getTitle());
                page.setContent(pageDetails.getContent());
                page.setMonth(pageDetails.getMonth());
                page.setYear(pageDetails.getYear());
                page.setPublished(pageDetails.getPublished());
                return ResponseEntity.ok(customPageRepository.save(page));
            })
            .orElse(ResponseEntity.notFound().build());
    }
    
    // Admin only - Delete page
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> deletePage(@PathVariable Long id) {
        return customPageRepository.findById(id)
            .map(page -> {
                customPageRepository.delete(page);
                return ResponseEntity.ok().build();
            })
            .orElse(ResponseEntity.notFound().build());
    }
    
    // Admin only - Toggle publish status
    @PatchMapping("/{id}/publish")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CustomPage> togglePublish(@PathVariable Long id) {
        return customPageRepository.findById(id)
            .map(page -> {
                page.setPublished(!page.getPublished());
                return ResponseEntity.ok(customPageRepository.save(page));
            })
            .orElse(ResponseEntity.notFound().build());
    }
}