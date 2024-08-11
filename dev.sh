#!/bin/bash
unlink neutralino.config.json
cp neutralino.dev.config.json neutralino.config.json
npx @neutralinojs/neu run