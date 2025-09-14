@echo off
echo Cleaning up repository...
git add .
git commit -m "Clean up repository: remove unnecessary files and temporary files"
echo Pushing to GitHub...
git push origin main
echo Push completed!
pause
