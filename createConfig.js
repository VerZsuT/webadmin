const readline = require('readline')
const fileSystem = require('fs')
const path = require('path')

var configData = {
    'localeName': 'en',
    'port': 90,
    'accessProtection': true,
    'accessLogin': 'admin',
    'accessPassword': 'admin'
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

rl.question(`Localization(${configData['localeName']}): `, (answer) => {
    addToConfig('localeName', answer)
    rl.question(`Port(${configData['port']}): `, (answer) => {
        addToConfig('port', answer) 
        rl.question(`Enable access protection?(${configData['accessProtection']}): `, (answer) => {
            addToConfig('accessProtection', answer == 'true')
            if (configData.accessProtection == true) {
                rl.question(`Access login(${configData['accessLogin']}): `, (answer) => {
                    addToConfig('accessLogin', answer)
                    rl.question(`Access password(${configData['accessPassword']}): `, (answer) => {
                        addToConfig('accessPassword', answer)
                        createConfig()
                        initService()
                        rl.close()
                    })
                })
            } else {
                createConfig()
                initService()
                rl.close()
            }
        })
    })
})

function addToConfig(paramName, value) {
    if (value) {configData[paramName] = value}
}

function initService() {
    let serviceUrl = path.join(__dirname, 'webadmin.service')
    let scriptUrl = path.join(__dirname, 'webadmin.js')

    fileSystem.writeFile(serviceUrl, `[Unit]\nDescription=webadmin-daemon\nAfter=network-online.target\n\n[Service]\nExecStart=/usr/bin/node ${scriptUrl}\n\n[Install]\nWantedBy=multi-user.target`, (error) => {
        if (error) {
            console.log(error)
        }
    })
}

function createConfig() {
    let configUrl = path.join(__dirname, 'config.json')

    fileSystem.writeFile(configUrl, JSON.stringify(configData), (error) => {
        if (error) {
            console.log(error)
        } else {
            console.log("Config file created.")
        }
    })
}
