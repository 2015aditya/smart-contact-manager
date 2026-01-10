package com.smartcontactmanager.controller;

import com.smartcontactmanager.dto.UserDTO;
import com.smartcontactmanager.entity.User;
import com.smartcontactmanager.security.CustomUserDetails;
import com.smartcontactmanager.service.FileStorageService;
import com.smartcontactmanager.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;

/**
 * User Controller
 * Handles user profile operations including image upload
 */
@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private FileStorageService fileStorageService;

    /**
     * Get current user profile
     * GET /api/user/profile
     */
    @GetMapping("/profile")
    public ResponseEntity<?> getCurrentUserProfile(Authentication authentication) {
        try {
            Long userId = getUserIdFromAuth(authentication);
            User user = userService.getCurrentUser(userId);
            
            UserDTO userDTO = new UserDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getImagePath()
            );
            
            return ResponseEntity.ok(userDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    /**
     * Upload user profile image
     * POST /api/user/profile/image
     */
    @PostMapping("/profile/image")
    public ResponseEntity<?> uploadProfileImage(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        try {
            Long userId = getUserIdFromAuth(authentication);
            
            // Delete old image if exists
            User user = userService.getCurrentUser(userId);
            if (user.getImagePath() != null && !user.getImagePath().isEmpty()) {
                fileStorageService.deleteFile(user.getImagePath());
            }
            
            // Store new image
            String imagePath = fileStorageService.storeFile(file, userId);
            
            // Update user with new image path
            User updatedUser = userService.updateUserImage(userId, imagePath);
            
            // Extract filename from path (e.g., "uploads/123_1234567890.jpg" -> "123_1234567890.jpg")
            String filename = imagePath.contains("/") ? imagePath.substring(imagePath.lastIndexOf("/") + 1) : imagePath;
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Image uploaded successfully");
            response.put("imagePath", updatedUser.getImagePath());
            response.put("imageUrl", "/api/user/images/" + filename);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Failed to upload image: " + e.getMessage()));
        }
    }

    /**
     * Serve uploaded images
     * GET /api/user/images/{filename}
     */
    @GetMapping("/images/{filename:.+}")
    public ResponseEntity<?> getImage(@PathVariable String filename) {
        try {
            Path imagePath = fileStorageService.getFilePath(filename);
            if (!java.nio.file.Files.exists(imagePath)) {
                return ResponseEntity.notFound().build();
            }
            
            byte[] imageBytes = java.nio.file.Files.readAllBytes(imagePath);
            String contentType = java.nio.file.Files.probeContentType(imagePath);
            if (contentType == null) {
                // Try to determine content type from extension
                if (filename.toLowerCase().endsWith(".png")) {
                    contentType = "image/png";
                } else if (filename.toLowerCase().endsWith(".gif")) {
                    contentType = "image/gif";
                } else if (filename.toLowerCase().endsWith(".webp")) {
                    contentType = "image/webp";
                } else {
                    contentType = "image/jpeg";
                }
            }
            
            return ResponseEntity.ok()
                    .header("Content-Type", contentType)
                    .body(imageBytes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Failed to load image: " + e.getMessage()));
        }
    }

    /**
     * Helper method to get user ID from authentication
     */
    private Long getUserIdFromAuth(Authentication authentication) {
        if (authentication.getPrincipal() instanceof CustomUserDetails) {
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            return userDetails.getUserId();
        }
        throw new RuntimeException("User ID not found in authentication");
    }

    /**
     * Error response class
     */
    private static class ErrorResponse {
        private String message;

        public ErrorResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}
