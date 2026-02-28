package com.blog.artist.artist.entity;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "paragraphs")
public class BioParagraph {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 5000)
    private String paragraph;

    @Column(nullable = false)
    private Integer page;

   @Column(name = "order_no", nullable = false)
    @JsonProperty("order")
    private Integer orderNum;

    // '1' = header row, null or '0' = regular paragraph
    @Column
    private String header;

    @Column
    private String language;
}