#!/bin/bash

# Parse options
PARSED_OPTIONS=$(getopt -n "$0" -o '' --long 'label:,command:' -- "$@")
if [ $? -ne 0 ]; then
  echo "Failed to parse options."
  exit 1
fi

eval set -- "$PARSED_OPTIONS"

LABEL=""
COMMAND=""

while true; do
  case "$1" in
    --label)
      LABEL="$2"
      shift 2
      ;;
    --command)
      COMMAND="$2"
      shift 2
      ;;
    --)
      shift
      break
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

# Check if --label and --command options are provided
if [ -z "$LABEL" ]; then
  echo "Error: --label option is required."
  exit 1
fi

if [ -z "$COMMAND" ]; then
  echo "Error: --command option is required."
  exit 1
fi

# Kill any existing screen session with the same label
echo "Killing any existing screen session named: $LABEL"
screen -S "$LABEL" -X quit 2>/dev/null

# Start a new screen session with the label, run the command, and detach
echo "Starting new screen session: $LABEL"
screen -dmS "$LABEL" bash -c "$COMMAND"





https://json.schemastore.org/task.json
https://github.com/BLaZeKiLL/Task-Runner
https://marketplace.visualstudio.com/items?itemName=Dago17.create-task
https://marketplace.visualstudio.com/items?itemName=pHofer94.vscode-taskviewexplorer
https://github.com/pHofer94/vscode-taskviewexplorer
https://marketplace.visualstudio.com/items?itemName=task.vscode-task
https://marketplace.visualstudio.com/items?itemName=hw104.launch-json-generator
https://github.com/sandipchitale/vscode-taskinfo-viewer
https://taskfile.dev/usage/