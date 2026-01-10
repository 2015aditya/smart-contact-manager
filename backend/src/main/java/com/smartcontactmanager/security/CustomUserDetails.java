package com.smartcontactmanager.security;

/**
 * Custom User Details to store email, role, and userId
 */
public class CustomUserDetails {
    private String email;
    private String role;
    private Long userId;

    public CustomUserDetails(String email, String role, Long userId) {
        this.email = email;
        this.role = role;
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public Long getUserId() {
        return userId;
    }

    @Override
    public String toString() {
        return email; // For authentication.getName()
    }
}
