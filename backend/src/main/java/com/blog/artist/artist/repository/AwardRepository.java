package com.blog.artist.artist.repository;

import com.blog.artist.artist.entity.Award;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AwardRepository extends JpaRepository<Award, Long> {
    List<Award> findAllByOrderByYearDesc();
}