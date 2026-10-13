@echo off
chcp 65001 > nul
echo ========================================================
echo   LinguaFlow - 英語学習アプリケーション
echo ========================================================
echo.
echo アプリケーションサーバーを起動しています...
echo ブラウザで http://localhost:8080 を開きます。
echo.
start http://localhost:8080
python -m http.server 8080
pause
