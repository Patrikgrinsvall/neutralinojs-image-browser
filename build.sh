#!/bin/bash
npx @neutralinojs/neu update
unlink neutralino.config.json &> /dev/null
cp neutralino.build.config.json neutralino.config.json
npx tailwindcss -i ./resources/styles.css -o ./resources/dist.css 
npx @neutralinojs/neu build