package com.blog.artist.artist.repository;

import com.blog.artist.artist.entity.BioParagraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface BioParagraphRepository extends JpaRepository<BioParagraph, Long> {

    // Used by the public BioPage – all rows ordered for grouping in React
    List<BioParagraph> findAllByOrderByPageAscOrderNumAsc();

    // Used by admin editor to load a single page's rows
    List<BioParagraph> findByPageOrderByOrderNumAsc(Integer page);

    // Used by admin to populate the page-number dropdown
    @Query("SELECT DISTINCT b.page FROM BioParagraph b ORDER BY b.page ASC")
    List<Integer> findDistinctPages();

    // Used when deleting all rows for a page before re-inserting (bulk save)
    void deleteAllByPage(Integer page);

}