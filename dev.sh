#!/bin/bash
unlink neutralino.config.json &> /dev/null
cp neutralino.dev.config.json neutralino.config.json
npx @neutralinojs/neu update
npx @neutralinojs/neu run /home/user/Pictures/