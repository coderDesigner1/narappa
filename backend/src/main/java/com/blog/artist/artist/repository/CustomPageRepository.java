package com.blog.artist.artist.repository;

import com.blog.artist.artist.entity.CustomPage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface CustomPageRepository extends JpaRepository<CustomPage, Long> {
    List<CustomPage> findByYearAndMonthOrderByCreatedAtDesc(Integer year, Integer month);
    List<CustomPage> findByYearOrderByMonthDesc(Integer year);
    
    @Query("SELECT DISTINCT p.year FROM CustomPage p ORDER BY p.year DESC")
    List<Integer> findDistinctYears();
    
    List<CustomPage> findByPublishedTrueOrderByYearDescMonthDesc();
}