#!/bin/bash

echo "Checking deployment criteria for: $VERCEL_GIT_COMMIT_REF"

# 1. Check for manual skip keywords in commit message
if [[ "$VERCEL_GIT_COMMIT_MESSAGE" == *"[skip ci]"* ]] || [[ "$VERCEL_GIT_COMMIT_MESSAGE" == *"[no build]"* ]] ; then
  echo "🛑 Build skipped due to skip keyword in commit message."
  exit 0;
fi

# 2. Always allow Preview deployments (Pull Requests)
# This ensures every PR gets a unique URL for testing.
if [[ "$VERCEL_ENV" == "preview" ]] ; then
  echo "✅ Preview build allowed."
  exit 1; 
fi

# 3. Support GitHub Releases & Manual Production Tags
# Regex matches: v1.0.0, 1.0.0, v1.0.0-beta.1, etc.
VERSION_REGEX="^v?[0-9]+\.[0-9]+\.[0-9]+(-.*)?$"

if [[ "$VERCEL_GIT_COMMIT_MESSAGE" == *"[release]"* ]] || \
   ([[ "$VERCEL_GIT_COMMIT_MESSAGE" == *"Merge pull request"* ]] && [[ "$VERCEL_GIT_COMMIT_REF" == "main" ]]) || \
   [[ "$VERCEL_GIT_COMMIT_REF" =~ $VERSION_REGEX ]] ; then
  echo "✅ Release criteria met. Proceeding with Production build."
  exit 1;
else
  # 4. Skip the build for everything else
  # This prevents every small push to main from consuming Vercel build minutes.
  echo "🛑 Build skipped. Commit does not meet release criteria."
  exit 0;
fi
