package com.smartcontactmanager.controller;

import com.smartcontactmanager.dto.ContactDTO;
import com.smartcontactmanager.security.CustomUserDetails;
import com.smartcontactmanager.service.ContactService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Contact Controller
 * Handles CRUD operations for contacts
 */
@RestController
@RequestMapping("/api/contacts")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class ContactController {

    @Autowired
    private ContactService contactService;


    /**
     * Create a new contact
     * POST /api/contacts
     */
    @PostMapping
    public ResponseEntity<?> createContact(@Valid @RequestBody ContactDTO contactDTO, 
                                           Authentication authentication) {
        try {
            String email = authentication.getName();
            // Get user ID from token - we'll need to store it in authentication
            // For simplicity, let's get it from a custom method
            Long userId = getUserIdFromAuth(authentication);
            ContactDTO created = contactService.createContact(contactDTO, userId);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    /**
     * Update a contact
     * PUT /api/contacts/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateContact(@PathVariable Long id,
                                          @Valid @RequestBody ContactDTO contactDTO,
                                          Authentication authentication) {
        try {
            Long userId = getUserIdFromAuth(authentication);
            ContactDTO updated = contactService.updateContact(id, contactDTO, userId);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    /**
     * Delete a contact
     * DELETE /api/contacts/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteContact(@PathVariable Long id,
                                          Authentication authentication) {
        try {
            Long userId = getUserIdFromAuth(authentication);
            contactService.deleteContact(id, userId);
            return ResponseEntity.ok().body(new SuccessResponse("Contact deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    /**
     * Get all contacts for current user
     * GET /api/contacts
     */
    @GetMapping
    public ResponseEntity<?> getAllContacts(Authentication authentication) {
        try {
            Long userId = getUserIdFromAuth(authentication);
            List<ContactDTO> contacts = contactService.getAllContacts(userId);
            return ResponseEntity.ok(contacts);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    /**
     * Search contacts
     * GET /api/contacts/search?keyword=...
     */
    @GetMapping("/search")
    public ResponseEntity<?> searchContacts(@RequestParam String keyword,
                                           Authentication authentication) {
        try {
            Long userId = getUserIdFromAuth(authentication);
            List<ContactDTO> contacts = contactService.searchContacts(userId, keyword);
            return ResponseEntity.ok(contacts);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
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
        // Fallback: get from UserService by email
        String email = authentication.getName();
        return contactService.getUserIdByEmail(email);
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
    }

    /**
     * Success response class
     */
    private static class SuccessResponse {
        private String message;

        public SuccessResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }
    }
}
