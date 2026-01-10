# Simple Connection Test Script
Write-Host "`n=== Connection Verification ===" -ForegroundColor Cyan
Write-Host ""

# 1. Check Backend
Write-Host "1. Backend (port 8080)..." -ForegroundColor Yellow
try {
    $null = Invoke-WebRequest -Uri "http://localhost:8080/api/auth/register" -Method GET -TimeoutSec 3 -ErrorAction Stop
    Write-Host "   [OK] Backend is RUNNING" -ForegroundColor Green
    $backendOK = $true
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode) {
        Write-Host "   [OK] Backend is RUNNING (status: $statusCode)" -ForegroundColor Green
        $backendOK = $true
    } else {
        Write-Host "   [FAIL] Backend NOT running" -ForegroundColor Red
        $backendOK = $false
    }
}

# 2. Check Frontend
Write-Host "`n2. Frontend (port 5173)..." -ForegroundColor Yellow
try {
    $null = Invoke-WebRequest -Uri "http://localhost:5173" -Method GET -TimeoutSec 3 -ErrorAction Stop
    Write-Host "   [OK] Frontend is RUNNING" -ForegroundColor Green
    $frontendOK = $true
} catch {
    Write-Host "   [FAIL] Frontend NOT running" -ForegroundColor Red
    $frontendOK = $false
}

# 3. Test Database via API
Write-Host "`n3. Database Connection (via API)..." -ForegroundColor Yellow
if ($backendOK) {
    $testEmail = "test_$(Get-Random)@test.com"
    $body = @{
        name = "Test User"
        email = $testEmail
        password = "test123"
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/register" -Method POST -ContentType "application/json" -Body $body -TimeoutSec 5
        Write-Host "   [OK] Database CONNECTED - User registered successfully" -ForegroundColor Green
        Write-Host "   Test User ID: $($response.userId)" -ForegroundColor Gray
        
        # Test login (verify read from DB)
        Write-Host "`n4. Testing Database Read..." -ForegroundColor Yellow
        $loginBody = @{
            email = $testEmail
            password = "test123"
        } | ConvertTo-Json
        
        $loginResp = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -ContentType "application/json" -Body $loginBody -TimeoutSec 5
        Write-Host "   [OK] Database READ successful - Login works" -ForegroundColor Green
        Write-Host "   User: $($loginResp.name) ($($loginResp.email))" -ForegroundColor Gray
        
    } catch {
        $errorText = $_.Exception.Message
        if ($errorText -match "Email already exists") {
            Write-Host "   [OK] Database CONNECTED (test user exists)" -ForegroundColor Green
        } elseif ($errorText -match "Connection refused|Communications link failure") {
            Write-Host "   [FAIL] MySQL connection refused - Service may be stopped" -ForegroundColor Red
        } elseif ($errorText -match "Access denied|Authentication failed") {
            Write-Host "   [FAIL] MySQL authentication failed - Check credentials" -ForegroundColor Red
        } elseif ($errorText -match "Unknown database") {
            Write-Host "   [FAIL] Database not found - Create database first" -ForegroundColor Red
        } else {
            Write-Host "   [FAIL] Error: $errorText" -ForegroundColor Red
        }
    }
} else {
    Write-Host "   [SKIP] Backend not running" -ForegroundColor Yellow
}

# 5. Check MySQL Service
Write-Host "`n5. MySQL Service..." -ForegroundColor Yellow
$mysql = Get-Service | Where-Object { $_.Name -like "*mysql*" }
if ($mysql) {
    foreach ($svc in $mysql) {
        $status = $svc.Status
        if ($status -eq "Running") {
            Write-Host "   [OK] MySQL Service '$($svc.DisplayName)' is RUNNING" -ForegroundColor Green
        } else {
            Write-Host "   [FAIL] MySQL Service '$($svc.DisplayName)' is STOPPED" -ForegroundColor Red
        }
    }
} else {
    Write-Host "   [WARN] MySQL service not found (may be named differently)" -ForegroundColor Yellow
}

# Summary
Write-Host "`n=== Summary ===" -ForegroundColor Cyan
Write-Host "Backend:  $(if ($backendOK) { '[OK]' } else { '[FAIL]' })"
Write-Host "Frontend: $(if ($frontendOK) { '[OK]' } else { '[FAIL]' })"
Write-Host "Database: Check results above"
Write-Host ""
