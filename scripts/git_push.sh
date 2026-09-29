#!/usr/bin/env bash
set -e

echo "🚀 Staging all project files (including CustomCursor and all assets)..."
git add -A

if git diff --staged --quiet; then
  echo "✨ Working tree is already 100% clean! Nothing new to commit."
else
  echo "📝 Creating sync commit..."
  git commit -m "fix(pdf): resolve standalone tab generator and eliminate navbar/footer overlaps during print"
  echo "⬆️  Pushing to GitHub (origin/main)..."
  git push origin main
  echo "✅ Successfully pushed all files to GitHub!"
fi
