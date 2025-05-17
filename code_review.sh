
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

# Create a directory for the review
REVIEW_DIR="code_review_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$REVIEW_DIR"

# Create a log file
LOG_FILE="$REVIEW_DIR/review_log.txt"
touch "$LOG_FILE"

echo "Code Review started at $(date)" > "$LOG_FILE"
echo "Directory: $DIRECTORY" >> "$LOG_FILE"

# Function to detect file type and return appropriate linting tool
get_linting_tool() {
  local file="$1"
  local extension="${file##*.}"
  
  case "$extension" in
    js|jsx|ts|tsx)
      echo "eslint"
      ;;
    py)
      echo "pylint"
      ;;
    rb)
      echo "rubocop"
      ;;
    go)
      echo "golint"
      ;;
    php)
      echo "phpcs"
      ;;
    java)
      echo "checkstyle"
      ;;
    *)
      echo "none"
      ;;
  esac
}

# Function to count lines of code
count_lines() {
  local file="$1"
  wc -l "$file" | awk '{print $1}'
}

# Function to check for TODO comments
check_todos() {
  local file="$1"
  grep -c "TODO\|FIXME" "$file" || echo "0"
}

# Check if git is available and if this is a git repository
if command -v git &> /dev/null && git rev-parse --is-inside-work-tree &> /dev/null; then
  # Use git to find modified files
  echo "Using git to find modified files..."
  MODIFIED_FILES=$(git status --porcelain | grep -E '^.M|^M' | awk '{print $2}')
  
  if [ -z "$MODIFIED_FILES" ]; then
    echo "No modified files found in git repository."
    echo "No modified files found in git repository." >> "$LOG_FILE"
    
    # Fallback to recently modified files
    echo "Falling back to recently modified files..."
    echo "Falling back to recently modified files..." >> "$LOG_FILE"
    MODIFIED_FILES=$(find . -type f -mtime -1 | grep -v "node_modules" | grep -v ".git" | grep -v "vendor" | grep -v "dist")
  else
    echo "Modified files found in git repository:"
    echo "$MODIFIED_FILES"
    echo "Modified files found in git repository:" >> "$LOG_FILE"
    echo "$MODIFIED_FILES" >> "$LOG_FILE"
  fi
else
  # Fallback to find recently modified files (last 24 hours)
  echo "Not a git repository or git not available."
  echo "Finding recently modified files (last 24 hours):"
  echo "Not a git repository or git not available." >> "$LOG_FILE"
  echo "Finding recently modified files (last 24 hours):" >> "$LOG_FILE"
  
  MODIFIED_FILES=$(find . -type f -mtime -1 | grep -v "node_modules" | grep -v ".git" | grep -v "vendor" | grep -v "dist")
  
  if [ -z "$MODIFIED_FILES" ]; then
    echo "No recently modified files found."
    echo "No recently modified files found." >> "$LOG_FILE"
  else
    echo "Recently modified files:"
    echo "$MODIFIED_FILES"
    echo "Recently modified files:" >> "$LOG_FILE"
    echo "$MODIFIED_FILES" >> "$LOG_FILE"
  fi
fi

# Copy files for review
if [ -n "$MODIFIED_FILES" ]; then
  echo "Copying files for review to $REVIEW_DIR..."
  echo "Copying files for review to $REVIEW_DIR..." >> "$LOG_FILE"
  
  for file in $MODIFIED_FILES; do
    # Skip binary files and non-text files
    if file "$file" | grep -q "text"; then
      # Create directory structure
      mkdir -p "$REVIEW_DIR/$(dirname "$file")"
      
      # Copy the file
      cp "$file" "$REVIEW_DIR/$file"
      
      # Get file metrics
      LINES=$(count_lines "$file")
      TODOS=$(check_todos "$file")
      LINTING_TOOL=$(get_linting_tool "$file")
      
      # Generate review template
      echo "# Code Review for $file" > "$REVIEW_DIR/${file}.review.md"
      echo "" >> "$REVIEW_DIR/${file}.review.md"
      echo "## File Information" >> "$REVIEW_DIR/${file}.review.md"
      echo "- Lines of code: $LINES" >> "$REVIEW_DIR/${file}.review.md"
      echo "- TODOs/FIXMEs: $TODOS" >> "$REVIEW_DIR/${file}.review.md"
      echo "- Recommended linting tool: $LINTING_TOOL" >> "$REVIEW_DIR/${file}.review.md"
      echo "" >> "$REVIEW_DIR/${file}.review.md"
      
      echo "## Quality" >> "$REVIEW_DIR/${file}.review.md"
      echo "- Code correctness:" >> "$REVIEW_DIR/${file}.review.md"
      echo "- Readability:" >> "$REVIEW_DIR/${file}.review.md"
      echo "- Naming conventions:" >> "$REVIEW_DIR/${file}.review.md"
      echo "- Error handling:" >> "$REVIEW_DIR/${file}.review.md"
      echo "- Edge cases:" >> "$REVIEW_DIR/${file}.review.md"
      echo "" >> "$REVIEW_DIR/${file}.review.md"
      
      echo "## Performance" >> "$REVIEW_DIR/${file}.review.md"
      echo "- Algorithmic efficiency:" >> "$REVIEW_DIR/${file}.review.md"
      echo "- Resource usage:" >> "$REVIEW_DIR/${file}.review.md"
      echo "- Optimization opportunities:" >> "$REVIEW_DIR/${file}.review.md"
      echo "" >> "$REVIEW_DIR/${file}.review.md"
      
      echo "## Security" >> "$REVIEW_DIR/${file}.review.md"
      echo "- Input validation:" >> "$REVIEW_DIR/${file}.review.md"
      echo "- Authentication/Authorization:" >> "$REVIEW_DIR/${file}.review.md"
      echo "- Data protection:" >> "$REVIEW_DIR/${file}.review.md"
      echo "- Vulnerability checks:" >> "$REVIEW_DIR/${file}.review.md"
      echo "" >> "$REVIEW_DIR/${file}.review.md"
      
      echo "## Maintainability" >> "$REVIEW_DIR/${file}.review.md"
      echo "- Code organization:" >> "$REVIEW_DIR/${file}.review.md"
      echo "- Documentation:" >> "$REVIEW_DIR/${file}.review.md"
      echo "- Test coverage:" >> "$REVIEW_DIR/${file}.review.md"
      echo "- Technical debt:" >> "$REVIEW_DIR/${file}.review.md"
      echo "" >> "$REVIEW_DIR/${file}.review.md"
      
      echo "## Recommendations" >> "$REVIEW_DIR/${file}.review.md"
      echo "- Critical issues:" >> "$REVIEW_DIR/${file}.review.md"
      echo "- Important improvements:" >> "$REVIEW_DIR/${file}.review.md"
      echo "- Minor suggestions:" >> "$REVIEW_DIR/${file}.review.md"
      echo "" >> "$REVIEW_DIR/${file}.review.md"
      
      echo "## Code Snippets" >> "$REVIEW_DIR/${file}.review.md"
      echo "```" >> "$REVIEW_DIR/${file}.review.md"
      echo "# Add relevant code snippets here with line numbers" >> "$REVIEW_DIR/${file}.review.md"
      echo "```" >> "$REVIEW_DIR/${file}.review.md"
      
      echo "Processed $file (Lines: $LINES, TODOs: $TODOS)" >> "$LOG_FILE"
    else
      echo "Skipping binary file: $file" >> "$LOG_FILE"
    fi
  done
  
  # Create a summary file
  echo "# Code Review Summary" > "$REVIEW_DIR/review_summary.md"
  echo "" >> "$REVIEW_DIR/review_summary.md"
  echo "Review created on: $(date)" >> "$REVIEW_DIR/review_summary.md"
  echo "" >> "$REVIEW_DIR/review_summary.md"
  echo "## Files Reviewed" >> "$REVIEW_DIR/review_summary.md"
  echo "" >> "$REVIEW_DIR/review_summary.md"
  
  for file in $MODIFIED_FILES; do
    if [ -f "$REVIEW_DIR/${file}.review.md" ]; then
      echo "- [$file](${file}.review.md)" >> "$REVIEW_DIR/review_summary.md"
    fi
  done
  
  echo "" >> "$REVIEW_DIR/review_summary.md"
  echo "## Overall Recommendations" >> "$REVIEW_DIR/review_summary.md"
  echo "" >> "$REVIEW_DIR/review_summary.md"
  echo "Please add overall recommendations after reviewing all files." >> "$REVIEW_DIR/review_summary.md"
  
  echo "Review templates created in $REVIEW_DIR"
  echo "Please review the files and fill in the review templates."
  echo "A summary file has been created at $REVIEW_DIR/review_summary.md"
  
  echo "Review templates created in $REVIEW_DIR" >> "$LOG_FILE"
  echo "Code review process completed at $(date)" >> "$LOG_FILE"
else
  echo "No files to review."
  echo "No files to review." >> "$LOG_FILE"
  rmdir "$REVIEW_DIR"
fi
