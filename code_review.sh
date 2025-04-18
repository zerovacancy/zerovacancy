#!/bin/bash

# Script to load and review files with pending code edits
# from the zerovacancy directory

# Set the directory path
DIRECTORY="/Users/michaelisrael/zerovacancy"

# Check if the directory exists
if [ ! -d "$DIRECTORY" ]; then
  echo "Error: Directory $DIRECTORY does not exist."
  exit 1
fi

# Find files with pending changes
echo "Finding files with pending changes in $DIRECTORY..."
cd "$DIRECTORY" || exit 1

# Check if git is available and if this is a git repository
if command -v git &> /dev/null && git rev-parse --is-inside-work-tree &> /dev/null; then
  # Use git to find modified files
  MODIFIED_FILES=$(git status --porcelain | grep -E '^.M|^M' | awk '{print $2}')
  
  if [ -z "$MODIFIED_FILES" ]; then
    echo "No modified files found in git repository."
  else
    echo "Modified files found in git repository:"
    echo "$MODIFIED_FILES"
  fi
else
  # Fallback to find recently modified files (last 24 hours)
  echo "Not a git repository or git not available."
  echo "Finding recently modified files (last 24 hours):"
  MODIFIED_FILES=$(find . -type f -mtime -1 | grep -v "node_modules" | grep -v ".git")
  
  if [ -z "$MODIFIED_FILES" ]; then
    echo "No recently modified files found."
  else
    echo "Recently modified files:"
    echo "$MODIFIED_FILES"
  fi
fi

# Create a directory for the review
REVIEW_DIR="code_review_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$REVIEW_DIR"

# Copy files for review
if [ -n "$MODIFIED_FILES" ]; then
  echo "Copying files for review to $REVIEW_DIR..."
  
  for file in $MODIFIED_FILES; do
    # Create directory structure
    mkdir -p "$REVIEW_DIR/$(dirname "$file")"
    
    # Copy the file
    cp "$file" "$REVIEW_DIR/$file"
    
    # Generate review template
    echo "# Code Review for $file" > "$REVIEW_DIR/${file}.review.md"
    echo "## Quality" >> "$REVIEW_DIR/${file}.review.md"
    echo "- " >> "$REVIEW_DIR/${file}.review.md"
    echo "## Performance" >> "$REVIEW_DIR/${file}.review.md"
    echo "- " >> "$REVIEW_DIR/${file}.review.md"
    echo "## Security" >> "$REVIEW_DIR/${file}.review.md"
    echo "- " >> "$REVIEW_DIR/${file}.review.md"
    echo "## Maintainability" >> "$REVIEW_DIR/${file}.review.md"
    echo "- " >> "$REVIEW_DIR/${file}.review.md"
    echo "## Recommendations" >> "$REVIEW_DIR/${file}.review.md"
    echo "- " >> "$REVIEW_DIR/${file}.review.md"
  done
  
  echo "Review templates created in $REVIEW_DIR"
  echo "Please review the files and fill in the review templates."
else
  echo "No files to review."
  rmdir "$REVIEW_DIR"
fi
