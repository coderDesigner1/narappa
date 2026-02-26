package com.blog.artist.artist.repository;

import com.blog.artist.artist.entity.VisitorLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDate;

public interface VisitorLogRepository extends JpaRepository<VisitorLog, Long> {

    // Check if this IP already visited today (prevents double counting)
    boolean existsByIpAddressAndVisitDate(String ipAddress, LocalDate visitDate);

    // Total unique visitors ever (distinct IPs)
    @Query("SELECT COUNT(DISTINCT v.ipAddress) FROM VisitorLog v")
    long countUniqueVisitors();

    // Unique visitors today
    @Query("SELECT COUNT(DISTINCT v.ipAddress) FROM VisitorLog v WHERE v.visitDate = :date")
    long countUniqueVisitorsByDate(LocalDate date);
}