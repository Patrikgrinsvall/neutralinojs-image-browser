#!/bin/bash

# Check if current user is root
if [ "$EUID" -ne 0 ]; then
  echo "❌ This script must be run as root."
  read -n1 -rsp "Press any key to exit..."
  echo
  exit 1
fi

echo "✅ You are running as root."

echo "Installing ..."
cd ..
mkdir {APP_PATH} || true
cp -v -r {APP_NAME} {APP_BASEPATH}

cd {APP_NAME}
chmod +x {APP_EXEC}
cp -v {APP_ICON} {APP_ICON_PATH}
cp -v {APP_NAME}.desktop /usr/share/applications/{APP_NAME}.desktop

read -p "Delete original files? (y/n): " answer
if [[ $answer == "y" ]]; then
    echo "Deleting ..."
    cd ..
    rm -rf {APP_NAME}
fi

echo "DONE."
read -n1 -rsp "Press any key to exit..."
echo
exit 0