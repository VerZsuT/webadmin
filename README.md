# webadmin
Web file manager for your linux server.

# Instalation
1. Unzip files.
2. Install **nodejs**:
```
sudo apt install nodejs
```

3. Install **npm**:
```
sudo apt install npm
```

4. Go to the folder with the unzipped files:
```
cd <PATH>
```

5. Install **webadmin**:
```
sudo npm run quickInstall
```

6. Go to the address 'http://<your_server_domen_or_ip>:(port)/

# NPM scripts
* **createConfig** - starts the configuration dialog.
* **start** - launch **webadmin**.
* **stop** - stop **webadmin**.
* **restart** - restart **webadmin**.
* **createService** - create a **webadmin** service to work in the background.
* **enableAutorun** - put **webadmin** on startup.
* **quickInstall** - run 'createConfig' -> 'createService' -> 'enableAutorun'.

# Config options
* **localeName** - language in which the file manager will work. _Default: **'en'**_
* **port** - port on which **webadmin** will work. _Default: **90**_
* **accessProtection** - enable/disable access protection. _Default: **true**_
* **accessLogin** - **webadmin** login. _Default: **'admin'**_
* **accessPassword** - **webadmin** password. _Default: **'admin'**_
