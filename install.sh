#!/bin/bash

echo "[WA]: Installing webadmin..."
sleep 1

echo "[WA]: Installing Node.js..."
sleep 1
apt install nodejs
echo "[WA]: Node.js installed."
sleep 1

echo "[WA]: Installing 'npm'..."
sleep 1
apt install npm
echo "[WA]: npm installed."
sleep 1

echo "[WA]: Creating webadmin config file..."
sleep 1
node createConfig.js
echo "[WA]: Config created."
sleep 1

echo "[WA]: Adding webadmin.service..."
sleep 1
mv webadmin.service /etc/systemd/system/webadmin.service
systemctl daemon-reload
echo "[WA]: webadmin.service added."
sleep 1

echo "[WA]: Adding webadmin to autorun..."
sleep 1
systemctl enable webadmin
echo "[WA]: Added."
sleep 1

echo "[WA]: Launch webadmin..."
sleep 1
systemctl start webadmin
echo "[WA]: webadmin is running."
sleep 1

echo "[WA]: webadmin installed."
exit 0