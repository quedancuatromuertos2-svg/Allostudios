@echo off
cd /d "c:\Users\cuent\Downloads\10 SKILLS ADRI Y JUANPE\voiceflow-ai\apps\web"

:: Check if server is already running on port 3000
netstat -ano | findstr ":3000 " >nul 2>&1
if %errorlevel% == 0 (
    echo Server already running, opening browser...
    timeout /t 1 /nobreak >nul
    start "" "http://localhost:3000"
    exit
)

:: Start server in background
echo Starting VoiceFlow AI server...
start "VoiceFlow AI Server" cmd /k "pnpm dev"

:: Wait for server to be ready then open browser
echo Waiting for server to start...
:waitloop
timeout /t 2 /nobreak >nul
netstat -ano | findstr ":3000 " >nul 2>&1
if %errorlevel% neq 0 goto waitloop

echo Ready! Opening browser...
start "" "http://localhost:3000"
