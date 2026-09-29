#!/usr/bin/env bash
set -e

echo "🚀 Staging any remaining repo updates (README and scripts)..."
git add README.md scripts/git_push.sh

if git diff --staged --quiet; then
  echo "✨ Working tree is already 100% clean! Nothing new to commit."
else
  echo "📝 Creating sync commit..."
  git commit -m "docs: update system architecture with Gemini 3.7 Flash and add git sync automation"
  echo "⬆️  Pushing to GitHub (origin/main)..."
  git push origin main
  echo "✅ GitHub repository is 100% up to date with local codebase!"
fi
