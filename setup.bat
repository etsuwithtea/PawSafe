@echo off
echo === PawSafe Setup Guide ===
echo.
echo Step 1: Installing Backend Dependencies...
cd server
call npm install
echo Backend dependencies installed!
echo.

echo Step 2: Setting up Backend Environment...
if not exist .env (
  copy .env.example .env
  echo Created .env file. Please update it with your MongoDB Connection String!
) else (
  echo .env file already exists
)
echo.

echo Step 3: Installing Frontend Dependencies...
cd ../client
call npm install
echo Frontend dependencies installed!
echo.

echo === Setup Complete! ===
echo.
echo To start the application:
echo 1. Terminal 1 (Backend): cd server ^&^& npm run dev
echo 2. Terminal 2 (Frontend): cd client ^&^& npm run dev
echo.
echo Frontend will be available at: http://localhost:5173
echo Backend will be available at: http://localhost:5000
