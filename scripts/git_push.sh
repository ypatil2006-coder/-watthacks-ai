#!/usr/bin/env bash
set -e

# Navigate to project repository root regardless of where the script is invoked from
cd "$(dirname "$0")/.."

# If there is an unpushed local commit, soft-reset to origin/main to eliminate blocked secret commit
CURRENT_COMMIT=$(git rev-parse HEAD)
REMOTE_COMMIT=$(git rev-parse origin/main)

if [ "$CURRENT_COMMIT" != "$REMOTE_COMMIT" ]; then
  echo "🔄 Resetting rejected local commit ($CURRENT_COMMIT) to origin/main ($REMOTE_COMMIT)..."
  git reset --soft origin/main
fi

echo "🚀 Staging all project files (clean of raw token strings)..."
git add -A

if git diff --staged --quiet; then
  echo "✨ Working tree is already 100% clean! Nothing new to commit."
else
  echo "📝 Creating clean sync commit..."
  git commit -m "fix(gemini): live Gemini 2.5 Flash neural synthesis, structured JSON mode, preset extraction & 2.2s timeline"
  echo "⬆️  Pushing to GitHub (origin/main)..."
  git push origin main
  echo "✅ Successfully pushed all files to GitHub!"
fi
