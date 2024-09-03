#!/bin/bash
unlink neutralino.config.json &> /dev/null
cp neutralino.build.config.json neutralino.config.json
npx @neutralinojs/neu update
npx @neutralinojs/neu build
