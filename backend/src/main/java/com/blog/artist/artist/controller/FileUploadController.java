package com.blog.artist.artist.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class FileUploadController {
    
    @Value("${file.upload-dir:./uploads}")
    private String uploadDir;
    
    @PostMapping("/image")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {
        Map<String, String> response = new HashMap<>();
        
        try {
            System.out.println("Upload request received");
            System.out.println("File: " + file.getOriginalFilename());
            System.out.println("Size: " + file.getSize());
            System.out.println("Content Type: " + file.getContentType());
            System.out.println("Upload directory: " + uploadDir);
            
            // Validate file type
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                System.err.println("Invalid content type: " + contentType);
                response.put("error", "Only image files are allowed");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Validate file size (max 10MB)
            if (file.getSize() > 10 * 1024 * 1024) {
                System.err.println("File too large: " + file.getSize());
                response.put("error", "File size must be less than 10MB");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Create upload directory if it doesn't exist
            File uploadDirectory = new File(uploadDir);
            if (!uploadDirectory.exists()) {
                boolean created = uploadDirectory.mkdirs();
                System.out.println("Upload directory created: " + created);
            }
            
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            System.out.println("Absolute upload path: " + uploadPath);
            
            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = ".jpg";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String filename = UUID.randomUUID().toString() + extension;
            
            // Save file
            Path filePath = uploadPath.resolve(filename);
            System.out.println("Saving file to: " + filePath);
            
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            System.out.println("File saved successfully");
            
            // Return file URL
            String fileUrl = "http://localhost:8080/uploads/" + filename;
            response.put("url", fileUrl);
            response.put("filename", filename);
            
            System.out.println("Returning URL: " + fileUrl);
            
            return ResponseEntity.ok(response);
            
        } catch (IOException e) {
            System.err.println("Upload failed with IOException: " + e.getMessage());
            e.printStackTrace();
            response.put("error", "File upload failed: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        } catch (Exception e) {
            System.err.println("Upload failed with unexpected error: " + e.getMessage());
            e.printStackTrace();
            response.put("error", "File upload failed: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}