package com.blog.artist.artist.controller;

import com.blog.artist.artist.entity.BioParagraph;
import com.blog.artist.artist.repository.BioParagraphRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bio-paragraphs")
@CrossOrigin(origins = "http://narappa-frontend:3000")
public class BioParagraphController {
    
    @Autowired
    private BioParagraphRepository bioParagraphRepository;
    
    @GetMapping
    public List<BioParagraph> getAllBioParagraphs(@RequestParam(required = false, defaultValue = "bio") String page) {
        if (page != null && !page.isEmpty()) {
            return bioParagraphRepository.findByPageOrderByOrderNoAsc(page);
        }
        return bioParagraphRepository.findAllByOrderByOrderNoAsc();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<BioParagraph> getBioParagraphById(@PathVariable Long id) {
        return bioParagraphRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public BioParagraph createBioParagraph(@RequestBody BioParagraph bioParagraph) {
        return bioParagraphRepository.save(bioParagraph);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BioParagraph> updateBioParagraph(@PathVariable Long id, @RequestBody BioParagraph bioParagraphDetails) {
        return bioParagraphRepository.findById(id)
                .map(bioParagraph -> {
                    bioParagraph.setParagraph(bioParagraphDetails.getParagraph());
                    bioParagraph.setPage(bioParagraphDetails.getPage());
                    bioParagraph.setOrderNo(bioParagraphDetails.getOrderNo());
                    bioParagraph.setHeader(bioParagraphDetails.getHeader());
                    return ResponseEntity.ok(bioParagraphRepository.save(bioParagraph));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteBioParagraph(@PathVariable Long id) {
        return bioParagraphRepository.findById(id)
                .map(bioParagraph -> {
                    bioParagraphRepository.delete(bioParagraph);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}