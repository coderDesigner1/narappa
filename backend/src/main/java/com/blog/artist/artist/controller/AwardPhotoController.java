package com.blog.artist.artist.controller;

import com.blog.artist.artist.entity.AwardPhoto;
import com.blog.artist.artist.repository.AwardPhotoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/award-photos")
@CrossOrigin(origins = "http://narappa-frontend:3000")
public class AwardPhotoController {
    
    @Autowired
    private AwardPhotoRepository awardPhotoRepository;
    
    @GetMapping
    public List<AwardPhoto> getAllAwardPhotos() {
        return awardPhotoRepository.findAllByOrderByYearDesc();
    }
    
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public AwardPhoto createAwardPhoto(@RequestBody AwardPhoto awardPhoto) {
        return awardPhotoRepository.save(awardPhoto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public void deleteAwardPhoto(@PathVariable Long id) {
        awardPhotoRepository.deleteById(id);
    }

    @PutMapping("/{id}")
@PreAuthorize("isAuthenticated()")
public ResponseEntity<AwardPhoto> updateAwardPhoto(@PathVariable Long id, @RequestBody AwardPhoto photoDetails) {
    return awardPhotoRepository.findById(id)
        .map(photo -> {
            photo.setCaption(photoDetails.getCaption());
            photo.setYear(photoDetails.getYear());
            photo.setEvent(photoDetails.getEvent());
            photo.setImageUrl(photoDetails.getImageUrl());
            return ResponseEntity.ok(awardPhotoRepository.save(photo));
        })
        .orElse(ResponseEntity.notFound().build());
}
}