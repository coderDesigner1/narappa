package com.blog.artist.artist.controller;

import com.blog.artist.artist.entity.Award;
import com.blog.artist.artist.repository.AwardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/awards")
@CrossOrigin(origins = "http://narappa-frontend:3000")
public class AwardController {
    
    @Autowired
    private AwardRepository awardRepository;
    
    @GetMapping
    public List<Award> getAllAwards() {
        return awardRepository.findAllByOrderByYearDesc();
    }
    
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public Award createAward(@RequestBody Award award) {
        return awardRepository.save(award);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public void deleteAward(@PathVariable Long id) {
        awardRepository.deleteById(id);
    }

    @PutMapping("/{id}")
@PreAuthorize("isAuthenticated()")
public ResponseEntity<Award> updateAward(@PathVariable Long id, @RequestBody Award awardDetails) {
    return awardRepository.findById(id)
        .map(award -> {
            award.setTitle(awardDetails.getTitle());
            award.setOrganization(awardDetails.getOrganization());
            award.setYear(awardDetails.getYear());
            award.setDescription(awardDetails.getDescription());
            return ResponseEntity.ok(awardRepository.save(award));
        })
        .orElse(ResponseEntity.notFound().build());
}
}