package com.blog.artist.artist.repository;

import com.blog.artist.artist.entity.Painting;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PaintingRepository extends JpaRepository<Painting, Long> {
    List<Painting> findAllByOrderByYearDesc();
}