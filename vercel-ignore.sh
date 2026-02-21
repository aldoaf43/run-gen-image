#!/bin/bash

# Vercel Ignored Build Step Script
# Protocol: exit 1 to BUILD, exit 0 to SKIP

echo "🔍 Checking deployment criteria for: $VERCEL_GIT_COMMIT_REF (Env: $VERCEL_ENV)"

# 1. Always allow Preview deployments (Pull Requests)
if [[ "$VERCEL_ENV" == "preview" ]] ; then
  echo "✅ Preview build allowed."
  exit 1; 
fi

# 2. Production Logic (Only for the main branch)
if [[ "$VERCEL_GIT_COMMIT_REF" == "main" ]] ; then
  # Convert commit message to lowercase for case-insensitive matching
  MESSAGE_LOWER=$(echo "$VERCEL_GIT_COMMIT_MESSAGE" | tr '[:upper:]' '[:lower:]')
  
  if [[ "$MESSAGE_LOWER" == *"[release]"* ]] ; then
    echo "🚀 [release] keyword found on main. Proceeding with Production build."
    exit 1;
  else
    echo "🛑 Skip: Main branch commit without [release] keyword."
    exit 0;
  fi
fi

# 3. Default: Skip the build for everything else (experimental branches, etc.)
echo "🛑 Build skipped: Does not meet production or preview criteria."
exit 0;
