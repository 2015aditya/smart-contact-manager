# 🔍 Connection Verification Guide

## Current Status Check

Based on the verification tests:

### ✅ Backend Server
- **Status:** RUNNING
- **Port:** 8080
- **Process ID:** 29048
- **URL:** http://localhost:8080

### ✅ Frontend Server
- **Status:** RUNNING
- **Port:** 5173
- **Process ID:** 19680
- **URL:** http://localhost:5173

### ⚠️ MySQL Service
- **Status:** Need to verify
- **Expected Port:** 3306
- **Database:** smart_contact_manager

## Verification Steps

### 1. Test Backend API Endpoints

#### Health Check (Basic)
```bash
# Using curl
curl http://localhost:8080/api/health

# Expected Response:
{
  "status": "UP",
  "service": "Smart Contact Manager",
  "timestamp": 1234567890
}
```

#### Database Connection Check
```bash
curl http://localhost:8080/api/health/db

# Expected Response (if connected):
{
  "status": "CONNECTED",
  "database": "MySQL",
  "version": "8.0.x",
  "url": "jdbc:mysql://localhost:3306/smart_contact_manager",
  "username": "root@localhost",
  "driverName": "MySQL Connector/J",
  ...
}

# Expected Response (if disconnected):
{
  "status": "DISCONNECTED",
  "error": "Connection refused / Access denied",
  ...
}
```

#### Full System Check
```bash
curl http://localhost:8080/api/health/full

# Shows both backend and database status
```

### 2. Test Frontend to Backend Communication

#### Test Registration Endpoint
```bash
# Register a test user
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@test.com",
    "password": "test123"
  }'

# Expected: JWT token response if successful
```

#### Test Login Endpoint
```bash
# Login with test user
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "test123"
  }'

# Expected: JWT token response
```

### 3. Test Database Directly

#### Using MySQL Command Line
```bash
# Connect to MySQL
mysql -u root -p

# Enter password when prompted
# Then run:
USE smart_contact_manager;
SHOW TABLES;
SELECT * FROM users;
SELECT * FROM contacts;
```

#### Check Database Exists
```sql
SHOW DATABASES LIKE 'smart_contact_manager';
```

#### Check Tables
```sql
USE smart_contact_manager;
SHOW TABLES;
DESCRIBE users;
DESCRIBE contacts;
```

### 4. Test Frontend in Browser

1. **Open Browser:**
   - Go to: http://localhost:5173

2. **Open Developer Console (F12)**
   - Go to Network tab
   - Try to register a new user
   - Check if API calls are being made to http://localhost:8080

3. **Check Console for Errors:**
   - Look for CORS errors
   - Look for 404/500 errors
   - Look for connection refused errors

### 5. Test Complete Flow

#### User Registration Flow
1. Frontend: http://localhost:5173/register
2. Fill form and submit
3. Check Network tab: Should see POST to /api/auth/register
4. Check Response: Should return JWT token
5. Check Database: New user should appear in `users` table

#### Contact Creation Flow
1. Login to dashboard
2. Add a contact
3. Check Network tab: Should see POST to /api/contacts
4. Check Response: Should return created contact
5. Check Database: New contact should appear in `contacts` table

## Troubleshooting

### Backend Not Responding

**Check if backend is running:**
```bash
# Windows
netstat -ano | findstr ":8080"

# Should show LISTENING status
```

**Check backend logs:**
- Look for "Started SmartContactManagerApplication"
- Look for database connection errors
- Look for port binding errors

### Database Connection Errors

**Common Errors:**

1. **"Connection refused"**
   - MySQL service not running
   - Solution: Start MySQL service

2. **"Access denied for user"**
   - Wrong username/password in application.properties
   - Solution: Update credentials

3. **"Unknown database 'smart_contact_manager'"**
   - Database doesn't exist
   - Solution: Create database or let Hibernate create it

**Check MySQL Service:**
```bash
# Windows
Get-Service MySQL80

# Or check in Services (Win+R → services.msc)
```

**Verify Database Credentials:**
- Check: `backend/src/main/resources/application.properties`
- Verify: `spring.datasource.username=root`
- Verify: `spring.datasource.password=YOUR_PASSWORD`

### Frontend Not Connecting to Backend

**CORS Issues:**
- Check backend CORS configuration
- Verify frontend URL is in allowed origins
- Check browser console for CORS errors

**Network Errors:**
- Verify backend is running on port 8080
- Check proxy configuration in vite.config.js
- Verify API_BASE_URL in frontend

**401/403 Errors:**
- JWT token missing or invalid
- Role/authority mismatch
- Check browser localStorage for token

## Automated Test Script

Create a test script to verify all connections:

```powershell
# verify_connections.ps1
Write-Host "=== Connection Verification ===" -ForegroundColor Cyan

# 1. Check Backend
Write-Host "`n1. Checking Backend..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/health" -Method Get
    Write-Host "✓ Backend is UP" -ForegroundColor Green
    Write-Host "  Status: $($response.status)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Backend is DOWN" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Gray
}

# 2. Check Database Connection
Write-Host "`n2. Checking Database Connection..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/health/db" -Method Get
    if ($response.status -eq "CONNECTED") {
        Write-Host "✓ Database is CONNECTED" -ForegroundColor Green
        Write-Host "  Database: $($response.database)" -ForegroundColor Gray
        Write-Host "  Version: $($response.version)" -ForegroundColor Gray
    } else {
        Write-Host "✗ Database is DISCONNECTED" -ForegroundColor Red
        Write-Host "  Error: $($response.error)" -ForegroundColor Gray
    }
} catch {
    Write-Host "✗ Cannot check database connection" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Gray
}

# 3. Check Frontend
Write-Host "`n3. Checking Frontend..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5173" -Method Get -TimeoutSec 3
    Write-Host "✓ Frontend is UP" -ForegroundColor Green
    Write-Host "  Status Code: $($response.StatusCode)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Frontend is DOWN" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Gray
}

# 4. Check MySQL Service
Write-Host "`n4. Checking MySQL Service..." -ForegroundColor Yellow
$mysqlService = Get-Service -Name "MySQL80" -ErrorAction SilentlyContinue
if ($mysqlService) {
    if ($mysqlService.Status -eq "Running") {
        Write-Host "✓ MySQL Service is RUNNING" -ForegroundColor Green
    } else {
        Write-Host "✗ MySQL Service is STOPPED" -ForegroundColor Red
        Write-Host "  Status: $($mysqlService.Status)" -ForegroundColor Gray
    }
} else {
    Write-Host "⚠ MySQL Service not found (might be named differently)" -ForegroundColor Yellow
}

Write-Host "`n=== Verification Complete ===" -ForegroundColor Cyan
```

## Manual Testing Checklist

- [ ] Backend server running on port 8080
- [ ] Frontend server running on port 5173
- [ ] MySQL service running
- [ ] Database `smart_contact_manager` exists
- [ ] Tables `users` and `contacts` exist
- [ ] Can register a new user (backend + database)
- [ ] Can login with credentials (backend + database)
- [ ] Can create a contact (backend + database)
- [ ] Can fetch contacts (backend + database)
- [ ] Frontend can call backend APIs (no CORS errors)
- [ ] JWT authentication working
- [ ] Data persists in database

## Quick Verification Commands

```bash
# Backend health
curl http://localhost:8080/api/health

# Database health
curl http://localhost:8080/api/health/db

# Full system check
curl http://localhost:8080/api/health/full

# Test registration (creates entry in database)
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"test123"}'
```

---

**Note:** After adding the HealthController, you may need to restart the backend server for the health endpoints to be available.
