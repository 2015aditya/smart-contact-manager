package com.smartcontactmanager.service;

import com.smartcontactmanager.dto.AuthResponse;
import com.smartcontactmanager.dto.LoginRequest;
import com.smartcontactmanager.dto.RegisterRequest;
import com.smartcontactmanager.entity.User;
import com.smartcontactmanager.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Service layer for Authentication operations
 */
@Service
public class AuthService {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * Register a new user
     */
    public AuthResponse register(RegisterRequest registerRequest) {
        User user = userService.registerUser(registerRequest);
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole(), user.getId());
        
        return new AuthResponse(token, user.getEmail(), user.getName(), user.getRole(), user.getId(), user.getImagePath());
    }

    /**
     * Login user
     */
    public AuthResponse login(LoginRequest loginRequest) {
        User user = userService.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole(), user.getId());
        
        return new AuthResponse(token, user.getEmail(), user.getName(), user.getRole(), user.getId(), user.getImagePath());
    }

    /**
     * Register a new admin
     */
    public AuthResponse registerAdmin(RegisterRequest registerRequest) {
        User user = userService.registerAdmin(registerRequest);
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole(), user.getId());
        
        return new AuthResponse(token, user.getEmail(), user.getName(), user.getRole(), user.getId(), user.getImagePath());
    }

    /**
     * Admin login
     */
    public AuthResponse adminLogin(LoginRequest loginRequest) {
        User user = userService.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        if (!user.getRole().equals("ROLE_ADMIN") && !user.getRole().equals("ADMIN")) {
            throw new RuntimeException("Access denied. Admin role required.");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole(), user.getId());
        
        return new AuthResponse(token, user.getEmail(), user.getName(), user.getRole(), user.getId(), user.getImagePath());
    }
}
