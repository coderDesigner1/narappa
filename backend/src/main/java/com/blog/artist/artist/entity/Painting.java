package com.blog.artist.artist.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "paintings")
public class Painting {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(nullable = false)
    private Integer year;
    
    private String medium;
    
    @Column(length = 1000)
    private String description;
    
    @Column(nullable = false)
    private String imageUrl;
}