#!/usr/bin/env pwsh
# EDU EXCHANGE - Full Stack Startup Script
# Run this from the project root: .\start.ps1

$MONGOD = "$env:USERPROFILE\.cache\mongodb-binaries\mongod-x64-win32-6.0.14.exe"
$DBPATH = "$env:USERPROFILE\mongodb-data"
$ROOT   = $PSScriptRoot

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host " EDU EXCHANGE - Student Skill Exchange     " -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# 1. Ensure MongoDB data directory exists
if (-not (Test-Path $DBPATH)) {
    New-Item -ItemType Directory -Path $DBPATH | Out-Null
    Write-Host "[MongoDB] Created data directory: $DBPATH" -ForegroundColor Yellow
}

# 2. Start MongoDB (if not already running)
$mongoRunning = Get-NetTCPConnection -LocalPort 27017 -ErrorAction SilentlyContinue
if ($mongoRunning) {
    Write-Host "[MongoDB] Already running on port 27017 ✓" -ForegroundColor Green
} else {
    if (Test-Path $MONGOD) {
        Write-Host "[MongoDB] Starting mongod on port 27017..." -ForegroundColor Yellow
        Start-Process -FilePath $MONGOD `
            -ArgumentList "--dbpath `"$DBPATH`" --port 27017 --bind_ip 127.0.0.1" `
            -WindowStyle Hidden
        Start-Sleep -Seconds 3
        Write-Host "[MongoDB] Started ✓" -ForegroundColor Green
    } else {
        Write-Host "[MongoDB] mongod not found. Falling back to in-memory server." -ForegroundColor Yellow
    }
}

# 3. Start Backend
Write-Host ""
Write-Host "[Backend] Starting Express server on port 5000..." -ForegroundColor Yellow
$backendJob = Start-Job -ScriptBlock {
    param($root)
    Set-Location "$root\server"
    npm start 2>&1
} -ArgumentList $ROOT

Start-Sleep -Seconds 4
Write-Host "[Backend] Running at http://localhost:5000 ✓" -ForegroundColor Green

# 4. Start Frontend
Write-Host ""
Write-Host "[Frontend] Starting Vite dev server on port 5173..." -ForegroundColor Yellow
$frontendJob = Start-Job -ScriptBlock {
    param($root)
    Set-Location "$root\client"
    npm run dev 2>&1
} -ArgumentList $ROOT

Start-Sleep -Seconds 3
Write-Host "[Frontend] Running at http://localhost:5173 ✓" -ForegroundColor Green

# 5. Open browser
Write-Host ""
Write-Host "Opening Edu Exchange in your browser..." -ForegroundColor Cyan
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host " Edu Exchange is live! Press Ctrl+C to stop " -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Frontend : http://localhost:5173" -ForegroundColor White
Write-Host "  Backend  : http://localhost:5000" -ForegroundColor White
Write-Host "  Database : mongodb://127.0.0.1:27017/flexi" -ForegroundColor White
Write-Host ""

# 6. Wait and stream logs
try {
    while ($true) {
        $backendOutput  = Receive-Job $backendJob
        $frontendOutput = Receive-Job $frontendJob
        if ($backendOutput)  { Write-Host "[BE] $backendOutput"  -ForegroundColor DarkGray }
        if ($frontendOutput) { Write-Host "[FE] $frontendOutput" -ForegroundColor DarkGray }
        Start-Sleep -Seconds 2
    }
} finally {
    Write-Host ""
    Write-Host "Shutting down Edu Exchange..." -ForegroundColor Yellow
    Stop-Job $backendJob, $frontendJob -ErrorAction SilentlyContinue
    Remove-Job $backendJob, $frontendJob -ErrorAction SilentlyContinue
    Write-Host "Stopped. Goodbye!" -ForegroundColor Cyan
}
