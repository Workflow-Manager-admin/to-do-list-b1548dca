#!/bin/bash
cd /home/kavia/workspace/code-generation/to-do-list-b1548dca/FrontendWebApplication
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

