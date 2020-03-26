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
sudo npm install
```

6. Change **conf.json** file:
* _localName_ - localization name (ru/en).
* _port_ - port on which the script will work.
* _acceptIp_ - ip from which the file manager will be available.

7. Run **webadmin**:
```
sudo node webadmin.js
```

8. Go to the address _http://<your_server_domen_or_ip>:(port)/_.
