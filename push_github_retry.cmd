@echo off
title Retry Push to GitHub

cd /d "%~dp0"

echo Current folder:
cd

echo.
echo Set Git network options...
git config --global http.version HTTP/1.1
git config --global http.postBuffer 524288000
git config --global http.lowSpeedLimit 0
git config --global http.lowSpeedTime 999999

echo.
echo Git remote:
git remote -v

echo.
echo Retry pushing to GitHub...
git push -u origin main

echo.
if errorlevel 1 (
  echo Push failed again.
  echo This is usually caused by network access to GitHub.
  echo Try changing network, enabling proxy/VPN, or using GitHub Desktop.
) else (
  echo Push succeeded.
  echo Please refresh your GitHub repository page.
)

echo.
pause
