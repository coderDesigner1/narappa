package com.blog.artist.artist.controller;

import com.blog.artist.artist.entity.Painting;
import com.blog.artist.artist.repository.PaintingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/paintings")
@CrossOrigin(origins = "http://narappa-frontend:3000", allowCredentials = "true")
public class PaintingController {
    
    @Autowired
    private PaintingRepository paintingRepository;
    
    @GetMapping
    public List<Painting> getAllPaintings() {
        return paintingRepository.findAllByOrderByYearDesc();
    }
    
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public Painting createPainting(@RequestBody Painting painting) {
        return paintingRepository.save(painting);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public void deletePainting(@PathVariable Long id) {
        paintingRepository.deleteById(id);
    }

    @PutMapping("/{id}")
@PreAuthorize("isAuthenticated()")
public ResponseEntity<Painting> updatePainting(@PathVariable Long id, @RequestBody Painting paintingDetails) {
    return paintingRepository.findById(id)
        .map(painting -> {
            painting.setTitle(paintingDetails.getTitle());
            painting.setYear(paintingDetails.getYear());
            painting.setMedium(paintingDetails.getMedium());
            painting.setDescription(paintingDetails.getDescription());
            painting.setImageUrl(paintingDetails.getImageUrl());
            return ResponseEntity.ok(paintingRepository.save(painting));
        })
        .orElse(ResponseEntity.notFound().build());
}
}