@echo off
echo === PawSafe Setup ===
echo.
echo Installing backend modules...
cd server
call npm install
echo.

echo Installing frontend modules...
cd ../client
call npm install
echo.

echo Setup Complete!
echo.
echo To start:
echo   Terminal 1: cd server && npm run dev
echo   Terminal 2: cd client && npm run dev
echo.

cd ..
pause
