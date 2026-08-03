@echo off
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch raw_insurance_dump.csv" --prune-empty --tag-name-filter cat -- --all
git push origin main --force
