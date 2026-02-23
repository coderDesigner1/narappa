package com.blog.artist.artist.controller;

import com.blog.artist.artist.entity.GuestbookEntry;
import com.blog.artist.artist.repository.GuestbookEntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/guestbook")
@CrossOrigin(origins = "http://narappa-frontend:3000")
public class GuestbookController {
    
    @Autowired
    private GuestbookEntryRepository guestbookEntryRepository;
    
    @GetMapping
    public List<GuestbookEntry> getAllEntries() {
        return guestbookEntryRepository.findAllByOrderByCreatedAtDesc();
    }
    
    @PostMapping
    public GuestbookEntry createEntry(@RequestBody GuestbookEntry entry) {
        return guestbookEntryRepository.save(entry);
    }
}