package com.blog.artist.artist.repository;

import com.blog.artist.artist.entity.GuestbookEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GuestbookEntryRepository extends JpaRepository<GuestbookEntry, Long> {
    List<GuestbookEntry> findAllByOrderByCreatedAtDesc();
    List<GuestbookEntry> findByParentIdOrderByCreatedAtAsc(Long parentId);
}