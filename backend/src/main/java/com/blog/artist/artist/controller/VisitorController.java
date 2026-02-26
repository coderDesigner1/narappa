package com.blog.artist.artist.controller;

import com.blog.artist.artist.entity.VisitorLog;
import com.blog.artist.artist.repository.VisitorLogRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/visitors")
@CrossOrigin(origins = "http://localhost:3000")
public class VisitorController {

    @Autowired
    private VisitorLogRepository visitorLogRepository;

    /**
     * Called by the frontend on every page load.
     * Records the visitor's IP (once per day) and returns total + today counts.
     */
    @PostMapping("/track")
    public ResponseEntity<Map<String, Long>> track(HttpServletRequest request) {
        String ip = getClientIp(request);
        LocalDate today = LocalDate.now();

        // Only insert if this IP hasn't been seen today
        if (!visitorLogRepository.existsByIpAddressAndVisitDate(ip, today)) {
            VisitorLog log = new VisitorLog();
            log.setIpAddress(ip);
            log.setVisitDate(today);
            visitorLogRepository.save(log);
        }

        Map<String, Long> response = new HashMap<>();
        response.put("total", visitorLogRepository.countUniqueVisitors());
        response.put("today", visitorLogRepository.countUniqueVisitorsByDate(today));

        return ResponseEntity.ok(response);
    }

    /**
     * Public endpoint to just read the counts without recording a visit.
     */
    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> count() {
        Map<String, Long> response = new HashMap<>();
        response.put("total", visitorLogRepository.countUniqueVisitors());
        response.put("today", visitorLogRepository.countUniqueVisitorsByDate(LocalDate.now()));
        return ResponseEntity.ok(response);
    }

    /**
     * Extract real IP — handles proxies and load balancers.
     */
    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip != null && !ip.isEmpty() && !"unknown".equalsIgnoreCase(ip)) {
            // X-Forwarded-For can be a comma-separated list; first one is the real client
            return ip.split(",")[0].trim();
        }
        ip = request.getHeader("X-Real-IP");
        if (ip != null && !ip.isEmpty() && !"unknown".equalsIgnoreCase(ip)) {
            return ip;
        }
        return request.getRemoteAddr();
    }
}