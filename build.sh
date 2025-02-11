#!/bin/bash
npx @neutralinojs/neu update
unlink neutralino.config.json &> /dev/null
cp neutralino.build.config.json neutralino.config.json
npx tailwindcss -i ./resources/styles.css -o ./resources/dist.css
npx @neutralinojs/neu build
cp imbr.sh dist/imbr
chmod +x dist/imbr/imbr.sh
chmod +x dist/imbr/imbr-linux_x64