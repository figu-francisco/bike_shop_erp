@echo off
echo Starting XAMPP...

:: Change directory to XAMPP installation folder
cd /d C:\xampp

:: Start XAMPP Control Panel (opens in new window)
start "" xampp-control.exe

:: Start Apache and MySQL in the same window
start "" /B apache_start.bat
start "" /B mysql_start.bat

:: Open project in VS Code (doesn't open a terminal window)
cd /d O:\TFE\bike_erp
start "" code .

:: Launch Postman from PRBD folder in the same window
cd /d C:\PRBD2425
call postman.bat

pause



