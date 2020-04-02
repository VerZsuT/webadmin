#!/bin/bash

echo "[WA]: Installing webadmin..."

echo "[WA]: Installing Node.js..."
apt install nodejs
echo "[WA]: Installed."
sleep 2

echo "[WA]: Installing 'npm'..."
apt install npm
echo "[WA]: Installed."
sleep 2

echo "[WA]: Dependency installation..."
npm install
echo "[WA]: Installed."
sleep 2

echo "[WA]: Creating webadmin config file..."
node createConfig.js
echo "[WA]: Created."
sleep 2

echo "[WA]: Adding webadmin.service..."
cp webadmin.service /etc/systemd/system/webadmin.service
systemctl daemon-reload
echo "[WA]: Added."
sleep 2

echo "[WA]: Adding webadmin to autorun..."
systemctl enable webadmin
echo "[WA]: Added."
sleep 2

echo "[WA]: Launch webadmin..."
systemctl start webadmin
echo "[WA]: webadmin is running."
sleep 2

echo "[WA]: webadmin installed."
exit 0