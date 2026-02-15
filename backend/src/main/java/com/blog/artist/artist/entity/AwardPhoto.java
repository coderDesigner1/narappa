package com.blog.artist.artist.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "award_photos")
public class AwardPhoto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String caption;
    
    @Column(nullable = false)
    private Integer year;
    
    private String event;
    
    @Column(nullable = false)
    private String imageUrl;
}