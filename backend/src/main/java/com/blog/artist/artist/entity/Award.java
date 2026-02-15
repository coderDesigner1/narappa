package com.blog.artist.artist.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "awards")
public class Award {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(nullable = false)
    private String organization;
    
    @Column(nullable = false)
    private Integer year;
    
    @Column(length = 1000)
    private String description;
}