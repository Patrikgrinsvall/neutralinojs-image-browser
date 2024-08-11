#!/bin/bash
unlink neutralino.config.json
cp neutralino.build.config.json neutralino.config.json
npx @neutralinojs/neu build
