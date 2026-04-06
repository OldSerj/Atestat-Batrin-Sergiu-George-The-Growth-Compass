#!/usr/bin/env bash

# Exit on error
set -e

# Find all files under source/ and add them to git
find -type f ! -path "*.git/*" -print0 | while IFS= read -r -d '' file; do
    echo "Adding: $file"
    git add "$file"
done

echo "All files under 'source/' have been added."