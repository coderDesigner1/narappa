package com.blog.artist.artist.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "guestbook_entries")
public class GuestbookEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false, length = 2000)
    private String message;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    // Add parent ID for threaded replies
    @Column(name = "parent_id")
    private Long parentId;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}