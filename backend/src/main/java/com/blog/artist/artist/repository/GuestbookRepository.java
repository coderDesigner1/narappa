package com.blog.artist.artist.repository;

import com.blog.artist.artist.entity.GuestbookEntry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GuestbookRepository extends JpaRepository<GuestbookEntry, Long> {

    /** All entries newest first (for public page) */
    List<GuestbookEntry> findAllByOrderByCreatedAtDesc();

    /** Find all replies for a given parent entry (used before deleting parent) */
    List<GuestbookEntry> findByParentId(Long parentId);
}