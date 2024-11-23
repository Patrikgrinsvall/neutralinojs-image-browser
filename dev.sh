#!/bin/bash

# Update the NeutralinoJS project
#npx @neutralinojs/neu update
nvm use --lts
# Replace the current configuration file with the development configuration
unlink neutralino.config.json &> /dev/null
cp neutralino.dev.config.json neutralino.config.json

# Start the Tailwind CSS compiler in the background and capture its process ID
node node_modules/.bin/tailwindcss -c ./tailwind.config.js -i ./resources/styles.css -o ./resources/dist.css --no-autoprefixer --watch
TAILWIND_PID=$!

# Start the NeutralinoJS server in the background and capture its process ID
npx @neutralinojs/neu run &
NEU_PID=$!
#export $NEU_PID
#export $TAILWIND_PID
# Handle Ctrl+C to terminate both processes
trap 'kill $(TAILWIND_PID) $(NEU_PID); exit' SIGINT

# Wait for either process to exit. If one does, terminate the other.
wait $TAILWIND_PID $NEU_PID
# shellcheck disable=SC2181
if [ $? -eq 0 ]; then
  echo "One of the processes has terminated unexpectedly."
  kill $TAILWIND_PID $NEU_PID 2> /dev/null
fi
