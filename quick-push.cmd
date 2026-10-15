@echo off
cd /d "c:\MIdtermProject\anihan_market"

echo Adding files...
git add .

echo Committing...
git commit -m "feat: complete e-commerce with auth and landing page improvements"

echo Pushing to GitHub...
git push origin master

echo.
echo Done! Vercel will auto-deploy in 30-60 seconds.
echo Check: https://github.com/jmdrosete/anihan-market
pause
