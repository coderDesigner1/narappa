package com.blog.artist.artist.repository;

import com.blog.artist.artist.entity.BioParagraph;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BioParagraphRepository extends JpaRepository<BioParagraph, Long> {
    List<BioParagraph> findByPageOrderByOrderNoAsc(String page);
    List<BioParagraph> findAllByOrderByOrderNoAsc();
}