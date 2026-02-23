package com.blog.artist.artist.controller;

import com.blog.artist.artist.entity.Admin;
import com.blog.artist.artist.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://narappa-frontend:3000", allowCredentials = "true")
public class AdminController {
    
    @Autowired
    private AdminRepository adminRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials) {
        System.out.println("=== LOGIN REQUEST RECEIVED ===");
        System.out.println("Username: " + credentials.get("username"));
        System.out.println("Password received: " + (credentials.get("password") != null ? "Yes" : "No"));
        
        String username = credentials.get("username");
        String password = credentials.get("password");
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Check if user exists
            Optional<Admin> adminOpt = adminRepository.findByUsername(username);
            
            if (!adminOpt.isPresent()) {
                System.out.println("User NOT found in database");
                response.put("error", "Invalid credentials");
                return ResponseEntity.status(401).body(response);
            }
            
            Admin admin = adminOpt.get();
            System.out.println("User found: " + admin.getUsername());
            System.out.println("Stored password hash: " + admin.getPassword());
            
            // Check password
            boolean passwordMatches = passwordEncoder.matches(password, admin.getPassword());
            System.out.println("Password matches: " + passwordMatches);
            
            if (passwordMatches) {
                // For now, return a simple token (you can add JWT later)
                response.put("token", "simple-token-" + username);
                response.put("username", username);
                response.put("message", "Login successful");
                System.out.println("=== LOGIN SUCCESSFUL ===");
                return ResponseEntity.ok(response);
            } else {
                System.out.println("Password does NOT match");
                response.put("error", "Invalid credentials");
                return ResponseEntity.status(401).body(response);
            }
            
        } catch (Exception e) {
            System.err.println("=== LOGIN ERROR ===");
            e.printStackTrace();
            response.put("error", "Login failed: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    // Test endpoint to check if admin exists
    @GetMapping("/check")
    public ResponseEntity<Map<String, Object>> checkAdmin() {
        Map<String, Object> response = new HashMap<>();
        long count = adminRepository.count();
        response.put("adminCount", count);
        
        Optional<Admin> admin = adminRepository.findByUsername("admin");
        response.put("adminExists", admin.isPresent());
        
        if (admin.isPresent()) {
            response.put("username", admin.get().getUsername());
            response.put("hasPassword", admin.get().getPassword() != null);
        }
        
        return ResponseEntity.ok(response);
    }
    
    // Endpoint to create/reset admin user
    @PostMapping("/create-admin")
    public ResponseEntity<Map<String, String>> createAdmin() {
        Map<String, String> response = new HashMap<>();
        
        try {
            // Delete existing admin if present
            adminRepository.findByUsername("admin").ifPresent(a -> adminRepository.delete(a));
            
            // Create new admin
            Admin admin = new Admin();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            adminRepository.save(admin);
            
            System.out.println("Admin user created successfully");
            System.out.println("Username: admin");
            System.out.println("Password: admin123");
            System.out.println("Encoded: " + admin.getPassword());
            
            response.put("message", "Admin user created successfully");
            response.put("username", "admin");
            response.put("password", "admin123");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            e.printStackTrace();
            response.put("error", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}