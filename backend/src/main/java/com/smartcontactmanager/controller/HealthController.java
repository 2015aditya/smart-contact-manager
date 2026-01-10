package com.smartcontactmanager.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.util.HashMap;
import java.util.Map;

/**
 * Health Check Controller
 * Provides endpoints to verify system health and database connectivity
 */
@RestController
@RequestMapping("/api/health")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class HealthController {

    @Autowired
    private DataSource dataSource;

    /**
     * Basic health check endpoint
     * GET /api/health
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "Smart Contact Manager");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }

    /**
     * Database connectivity check
     * GET /api/health/db
     */
    @GetMapping("/db")
    public ResponseEntity<Map<String, Object>> checkDatabase() {
        Map<String, Object> response = new HashMap<>();
        
        try (Connection connection = dataSource.getConnection()) {
            DatabaseMetaData metaData = connection.getMetaData();
            
            response.put("status", "CONNECTED");
            response.put("database", metaData.getDatabaseProductName());
            response.put("version", metaData.getDatabaseProductVersion());
            response.put("url", metaData.getURL());
            response.put("username", metaData.getUserName());
            response.put("driverName", metaData.getDriverName());
            response.put("driverVersion", metaData.getDriverVersion());
            response.put("readOnly", connection.isReadOnly());
            response.put("catalog", connection.getCatalog());
            response.put("timestamp", System.currentTimeMillis());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "DISCONNECTED");
            response.put("error", e.getMessage());
            response.put("errorClass", e.getClass().getSimpleName());
            response.put("timestamp", System.currentTimeMillis());
            return ResponseEntity.status(503).body(response);
        }
    }

    /**
     * Full system check (backend + database)
     * GET /api/health/full
     */
    @GetMapping("/full")
    public ResponseEntity<Map<String, Object>> fullCheck() {
        Map<String, Object> response = new HashMap<>();
        Map<String, Object> backend = new HashMap<>();
        Map<String, Object> database = new HashMap<>();
        
        // Backend check
        backend.put("status", "UP");
        backend.put("port", 8080);
        backend.put("timestamp", System.currentTimeMillis());
        
        // Database check
        try (Connection connection = dataSource.getConnection()) {
            DatabaseMetaData metaData = connection.getMetaData();
            
            database.put("status", "CONNECTED");
            database.put("product", metaData.getDatabaseProductName());
            database.put("version", metaData.getDatabaseProductVersion());
            database.put("database", connection.getCatalog());
            database.put("timestamp", System.currentTimeMillis());
        } catch (Exception e) {
            database.put("status", "DISCONNECTED");
            database.put("error", e.getMessage());
            database.put("timestamp", System.currentTimeMillis());
        }
        
        response.put("backend", backend);
        response.put("database", database);
        response.put("overallStatus", database.get("status").equals("CONNECTED") ? "HEALTHY" : "DEGRADED");
        response.put("timestamp", System.currentTimeMillis());
        
        return ResponseEntity.ok(response);
    }
}
