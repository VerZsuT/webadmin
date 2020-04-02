#!/bin/bash

echo "[WA]: Installing webadmin..."
sleep 2

echo "[WA]: Installing Node.js..."
sleep 1
apt install nodejs
echo "[WA]: Installed."
sleep 2

echo "[WA]: Installing 'npm'..."
sleep 1
apt install npm
echo "[WA]: Installed."
sleep 2

echo "[WA]: Dependency installation..."
sleep 1
npm install
echo "[WA]: Installed."
sleep 2

echo "[WA]: Creating webadmin config file..."
sleep 1
node createConfig.js
echo "[WA]: Created."
sleep 2

echo "[WA]: Adding webadmin.service..."
sleep 1
cp webadmin.service /etc/systemd/system/webadmin.service
systemctl daemon-reload
echo "[WA]: Added."
sleep 2

echo "[WA]: Adding webadmin to autorun..."
sleep 1
systemctl enable webadmin
echo "[WA]: Added."
sleep 2

echo "[WA]: Launch webadmin..."
sleep 1
systemctl start webadmin
echo "[WA]: webadmin is running."
sleep 2

echo "[WA]: webadmin installed."
exit 0
