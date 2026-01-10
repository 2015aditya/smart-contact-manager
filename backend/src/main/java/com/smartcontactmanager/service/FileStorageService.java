package com.smartcontactmanager.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

/**
 * Service for handling file uploads (user profile images)
 */
@Service
public class FileStorageService {

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    /**
     * Store user profile image
     * @param file The uploaded file
     * @param userId The user ID to create unique filename
     * @return The file path relative to upload directory
     * @throws IOException if file operations fail
     */
    public String storeFile(MultipartFile file, Long userId) throws IOException {
        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }

        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new RuntimeException("Only image files are allowed");
        }

        // Validate file size (max 5MB)
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new RuntimeException("File size exceeds 5MB limit");
        }

        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate unique filename: userId_timestamp_originalName
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String uniqueFilename = userId + "_" + System.currentTimeMillis() + extension;

        // Save file
        Path targetLocation = uploadPath.resolve(uniqueFilename);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

        // Return relative path for URL construction
        return "uploads/" + uniqueFilename;
    }

    /**
     * Delete file if it exists
     * @param filePath The file path to delete (can be relative like "uploads/filename.jpg" or just "filename.jpg")
     */
    public void deleteFile(String filePath) {
        try {
            if (filePath != null && !filePath.isEmpty()) {
                // Handle both relative paths (uploads/filename.jpg) and just filename
                String filename = filePath.contains("/") ? filePath.substring(filePath.lastIndexOf("/") + 1) : filePath;
                Path fileToDelete = Paths.get(uploadDir).resolve(filename);
                if (Files.exists(fileToDelete)) {
                    Files.delete(fileToDelete);
                }
            }
        } catch (IOException e) {
            // Log error but don't throw - file deletion is not critical
            System.err.println("Failed to delete file: " + filePath);
        }
    }

    /**
     * Get the full path to the upload directory
     * @return Path to upload directory
     */
    public Path getUploadPath() {
        return Paths.get(uploadDir);
    }

    /**
     * Get file path by filename
     * @param filename The filename
     * @return Full path to the file
     */
    public Path getFilePath(String filename) {
        return Paths.get(uploadDir).resolve(filename);
    }
}
