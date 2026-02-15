package com.blog.artist.artist.repository;

import com.blog.artist.artist.entity.AwardPhoto;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AwardPhotoRepository extends JpaRepository<AwardPhoto, Long> {
    List<AwardPhoto> findAllByOrderByYearDesc();
}