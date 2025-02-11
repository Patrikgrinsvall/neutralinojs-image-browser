#!/bin/sh

# Directory where this script resides
APP_DIR="$(dirname "$0")"

# This will hold the path (if one is provided)
USER_PATH=""

# Go through all arguments
for arg in "$@"
do
  # If argument doesn't start with "--" ...
  if [ "${arg#--}" = "$arg" ]; then
    # ... then treat it as a path candidate
    USER_PATH="$arg"
  fi
done

# If we never found a path argument, default to current working directory
if [ -z "$USER_PATH" ]; then
  USER_PATH="$(pwd)"
else
  # Convert to an absolute path (resolves "." or "..")
  USER_PATH="$(cd "$USER_PATH" && pwd)"
fi

# Launch the binary with the resolved path
exec "$APP_DIR/imbr-linux_x64" "$USER_PATH"