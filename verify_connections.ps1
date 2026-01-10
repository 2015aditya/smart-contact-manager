# Connection Verification Script for Smart Contact Manager
Write-Host "`n=== Connection Verification ===" -ForegroundColor Cyan
Write-Host ""

# 1. Check Backend Server
Write-Host "1. Checking Backend Server (port 8080)..." -ForegroundColor Yellow
$backendRunning = $false
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/auth/register" -Method GET -TimeoutSec 3 -ErrorAction Stop
    Write-Host "   ✓ Backend is RUNNING on port 8080" -ForegroundColor Green
    Write-Host "   Status Code: $($response.StatusCode)" -ForegroundColor Gray
    $backendRunning = $true
} catch {
    $statusCode = $null
    try {
        $statusCode = $_.Exception.Response.StatusCode.value__
    } catch {}
    
    if ($statusCode) {
        Write-Host "   ✓ Backend is RUNNING (returned error response - server is up)" -ForegroundColor Green
        $backendRunning = $true
    } else {
        Write-Host "   ✗ Backend is NOT RUNNING on port 8080" -ForegroundColor Red
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Gray
    }
}

# 2. Check Frontend Server
Write-Host "`n2. Checking Frontend Server (port 5173)..." -ForegroundColor Yellow
$frontendRunning = $false
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5173" -Method GET -TimeoutSec 3 -ErrorAction Stop
    Write-Host "   ✓ Frontend is RUNNING on port 5173" -ForegroundColor Green
    Write-Host "   Status Code: $($response.StatusCode)" -ForegroundColor Gray
    $frontendRunning = $true
} catch {
    Write-Host "   ✗ Frontend is NOT RUNNING on port 5173" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Gray
}

# 3. Test Database Connection via API (User Registration Test)
Write-Host "`n3. Testing Database Connection (via API)..." -ForegroundColor Yellow
if ($backendRunning) {
    $testEmail = "test_verify_$(Get-Date -Format 'yyyyMMddHHmmss')@test.com"
    $testData = @{
        name = "Test User"
        email = $testEmail
        password = "test123"
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/register" `
            -Method POST `
            -ContentType "application/json" `
            -Body $testData `
            -TimeoutSec 5
        
        Write-Host "   ✓ Database is CONNECTED and WORKING" -ForegroundColor Green
        Write-Host "   ✓ User registration successful (data saved to database)" -ForegroundColor Green
        Write-Host "   Test User Email: $testEmail" -ForegroundColor Gray
        Write-Host "   User ID: $($response.userId)" -ForegroundColor Gray
        
        # Test login to verify data retrieval
        Write-Host "`n4. Testing Database Read Operation (via Login)..." -ForegroundColor Yellow
        $loginData = @{
            email = $testEmail
            password = "test123"
        } | ConvertTo-Json
        
        try {
            $loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" `
                -Method POST `
                -ContentType "application/json" `
                -Body $loginData `
                -TimeoutSec 5
            
            Write-Host "   ✓ Database READ operation successful" -ForegroundColor Green
            Write-Host "   ✓ Login successful (data retrieved from database)" -ForegroundColor Green
            Write-Host "   User Name: $($loginResponse.name)" -ForegroundColor Gray
        } catch {
            Write-Host "   ✗ Database READ operation failed" -ForegroundColor Red
            Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Gray
        }
        
    } catch {
        $errorMsg = $_.Exception.Message
        $responseError = $null
        try {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $responseBody = $reader.ReadToEnd()
            $errorObj = $responseBody | ConvertFrom-Json -ErrorAction SilentlyContinue
            if ($errorObj.message) {
                $responseError = $errorObj.message
            }
        } catch {}
        
        if ($responseError -or $errorMsg) {
            $finalError = if ($responseError) { $responseError } else { $errorMsg }
            
            if ($finalError -like "*Email already exists*") {
                Write-Host "   ✓ Database is CONNECTED (test user already exists)" -ForegroundColor Green
            } elseif ($finalError -like "*Connection refused*" -or $finalError -like "*Communications link failure*") {
                Write-Host "   ✗ Database CONNECTION FAILED" -ForegroundColor Red
                Write-Host "   Error: MySQL connection refused" -ForegroundColor Gray
                Write-Host "   Solution: Check if MySQL service is running" -ForegroundColor Yellow
            } elseif ($finalError -like "*Access denied*" -or $finalError -like "*Authentication failed*") {
                Write-Host "   ✗ Database AUTHENTICATION FAILED" -ForegroundColor Red
                Write-Host "   Error: Wrong username/password" -ForegroundColor Gray
                Write-Host "   Solution: Update credentials in application.properties" -ForegroundColor Yellow
            } elseif ($finalError -like "*Unknown database*") {
                Write-Host "   ✗ Database NOT FOUND" -ForegroundColor Red
                Write-Host "   Error: Database 'smart_contact_manager' does not exist" -ForegroundColor Gray
                Write-Host "   Solution: Create database or let Hibernate create it" -ForegroundColor Yellow
            } else {
                Write-Host "   ✗ Database operation FAILED" -ForegroundColor Red
                Write-Host "   Error: $finalError" -ForegroundColor Gray
            }
        } else {
            Write-Host "   ✗ Database operation FAILED" -ForegroundColor Red
            Write-Host "   Error: Unknown error occurred" -ForegroundColor Gray
        }
    }
} else {
    Write-Host "   ⚠ Skipping database test (backend not running)" -ForegroundColor Yellow
}

# 5. Check MySQL Service
Write-Host "`n5. Checking MySQL Service..." -ForegroundColor Yellow
$mysqlServices = Get-Service | Where-Object { $_.Name -like "*mysql*" -or $_.DisplayName -like "*mysql*" -or $_.DisplayName -like "*MySQL*" }
if ($mysqlServices) {
    foreach ($service in $mysqlServices) {
        if ($service.Status -eq "Running") {
            Write-Host "   ✓ MySQL Service '$($service.DisplayName)' is RUNNING" -ForegroundColor Green
            Write-Host "   Status: $($service.Status)" -ForegroundColor Gray
        } else {
            Write-Host "   ✗ MySQL Service '$($service.DisplayName)' is STOPPED" -ForegroundColor Red
            Write-Host "   Status: $($service.Status)" -ForegroundColor Gray
        }
    }
} else {
    Write-Host "   ⚠ MySQL Service not found (might be named differently or not installed)" -ForegroundColor Yellow
    Write-Host "   Try: Get-Service | Where-Object {`$_.DisplayName -like '*SQL*'}" -ForegroundColor Gray
}

# 6. Check Port Usage
Write-Host "`n6. Checking Port Usage..." -ForegroundColor Yellow
$port8080 = netstat -ano | Select-String ":8080" | Select-Object -First 1
$port5173 = netstat -ano | Select-String ":5173" | Select-Object -First 1
$port3306 = netstat -ano | Select-String ":3306" | Select-Object -First 1

if ($port8080) {
    Write-Host "   ✓ Port 8080 is in use (Backend)" -ForegroundColor Green
} else {
    Write-Host "   ✗ Port 8080 is NOT in use" -ForegroundColor Red
}

if ($port5173) {
    Write-Host "   ✓ Port 5173 is in use (Frontend)" -ForegroundColor Green
} else {
    Write-Host "   ✗ Port 5173 is NOT in use" -ForegroundColor Red
}

if ($port3306) {
    Write-Host "   ✓ Port 3306 is in use (MySQL)" -ForegroundColor Green
} else {
    Write-Host "   ✗ Port 3306 is NOT in use (MySQL may not be running)" -ForegroundColor Yellow
}

# 7. Test Frontend to Backend Communication (CORS)
Write-Host "`n7. Testing CORS Configuration..." -ForegroundColor Yellow
if ($backendRunning -and $frontendRunning) {
    try {
        $headers = @{
            "Origin" = "http://localhost:5173"
            "Access-Control-Request-Method" = "POST"
            "Access-Control-Request-Headers" = "Content-Type"
        }
        
        $response = Invoke-WebRequest -Uri "http://localhost:8080/api/auth/register" `
            -Method OPTIONS `
            -Headers $headers `
            -TimeoutSec 3 `
            -ErrorAction Stop
        
        $corsHeaders = $response.Headers
        
        if ($corsHeaders["Access-Control-Allow-Origin"]) {
            Write-Host "   ✓ CORS is properly configured" -ForegroundColor Green
            Write-Host "   Allowed Origin: $($corsHeaders['Access-Control-Allow-Origin'])" -ForegroundColor Gray
        } else {
            Write-Host "   ⚠ CORS headers not found in response" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "   ⚠ CORS preflight test inconclusive" -ForegroundColor Yellow
        Write-Host "   (This is normal if OPTIONS requests aren't explicitly handled)" -ForegroundColor Gray
    }
} else {
    Write-Host "   ⚠ Skipping CORS test (servers not running)" -ForegroundColor Yellow
}

# Summary
Write-Host "`n=== Summary ===" -ForegroundColor Cyan
Write-Host "Backend:  $(if ($backendRunning) { '✓ RUNNING' } else { '✗ NOT RUNNING' })" -ForegroundColor $(if ($backendRunning) { 'Green' } else { 'Red' })
Write-Host "Frontend: $(if ($frontendRunning) { '✓ RUNNING' } else { '✗ NOT RUNNING' })" -ForegroundColor $(if ($frontendRunning) { 'Green' } else { 'Red' })
Write-Host "Database: $(if ($backendRunning) { 'Check results above' } else { 'Cannot test - backend not running' })" -ForegroundColor $(if ($backendRunning) { 'Gray' } else { 'Yellow' })

Write-Host "`n=== Verification Complete ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Note: Health endpoints are available at:" -ForegroundColor Gray
Write-Host "  - http://localhost:8080/api/health" -ForegroundColor Gray
Write-Host "  - http://localhost:8080/api/health/db" -ForegroundColor Gray
Write-Host "  - http://localhost:8080/api/health/full" -ForegroundColor Gray
Write-Host ""
Write-Host "(May need to restart backend to access health endpoints)" -ForegroundColor Yellow
