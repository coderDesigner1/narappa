package com.blog.artist.artist.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "paragraphs")
public class BioParagraph {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String paragraph;
    
    @Column(nullable = false, length = 50)
    private String page = "bio";
    
    @Column(nullable = false)
    private Integer orderNo;
    
    @Column(length = 255)
    private String header;
}