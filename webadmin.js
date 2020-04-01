const express = require('express')
const multer = require('multer')
const app = express()

const path = require('path')
const fileSystem = require('fs')
const locale = require('./locale.js')
const AdmZip = require('adm-zip')

const config = JSON.parse(fileSystem.readFileSync(path.join(__dirname, 'config.json')))
const upload = multer({'dest': path.join(__dirname, 'temp')})

app.use(express.json())
app.use(express.urlencoded({'extended': true}))

app.use(express.static(path.join(__dirname, 'public')))
app.use('/layouts', (request, response, next) => {response.sendStatus(404)})

const file = undefined
const fileDirUrl = undefined

// Access protection
if (config.accessProtection) {
    app.use('/', upload.single('file'), (request, response, next) => {
        let access = false
        let accessCode = request.body.accessCode
        let login = request.body.login
        let password = request.body.password

        if (accessCode == `access_${config.accessLogin}_${config.accessPassword}`) {
            access = true
        }

        if (login == config.accessLogin && password == config.accessPassword) {
            access = true
            response.cookie('accessCode', `access_${login}_${password}`)
        }

        if (!access) {
            fileSystem.readFile(path.join(__dirname, 'public', 'layouts', 'auth.html'), (error, fileData) => {
                if (error) {
                    response.sendStatus(404)
                    return
                } else {
                    response.send(locale(config.localeName, fileData.toString('utf8')))
                }
            })
        } else {
            if (request.file) {
                uploadFile(request, response)
            } else {
                next()
            }
        }
    })
}


// File manager web path
app.get('/', (request, response) => {
    response.redirect('/fileManager')
})

let fileManagerCallback = (request, response) => {
    fileSystem.readFile(path.join(__dirname, 'public', 'layouts', 'fileManager.html'), (error, fileData) => {
        if (error) {
            response.sendStatus(404)
            return
        } else {
            response.send(locale(config.localeName, fileData.toString('utf8')))
        }
    })
}

app.get('/fileManager', fileManagerCallback)
app.post('/fileManager', fileManagerCallback)


// Webadmin web api
app.post('/api/file.save', (request, response) => {
    let url = request.body.url
    let fileData = request.body.fileData

    if (!url || !fileData) {
        response.sendStatus(400)
        return
    } else {
        fileSystem.writeFile(url, fileData, (error) => baseCallback(error, response))
    }
})

app.post('/api/file.create', (request, response) => {
    let fileUrl = request.body.url
    if (!fileUrl) {
        response.sendStatus(400)
        return
    }

    fileSystem.writeFile(fileUrl, "", (error) => baseCallback(error, response))
})

app.post('/api/file.rename', (request, response) => {
    let curUrl = request.body.url
    let newUrl = request.body.newUrl
    if (!curUrl || !newUrl) {
        response.sendStatus(400)
        return
    }

    fileSystem.rename(curUrl, newUrl, (error) => baseCallback(error, response))
})

app.post('/api/file.remove', (request, response) => {
    let fileUrl = request.body.url
    if (!fileUrl) {
        response.sendStatus(400)
        return
    }

    fileSystem.unlink(fileUrl, (error) => baseCallback(error, response))
})

app.post('/api/file.upload', upload.single('file'), (request, response) => {
    let fileData = request.file
    let dirUrl = request.body.dirUrl
    if (!fileData) {
        response.sendStatus(400)
        return
    }

    fileSystem.rename(fileData.path, path.join(dirUrl, fileData.originalname), (error) => baseCallback(error, response))
})

function uploadFile(request, response) {
    let fileData = request.file
    let dirUrl = request.body.dirUrl
    if (!request.file) {
        response.sendStatus(400)
        return
    }

    fileSystem.rename(fileData.path, path.join(dirUrl, fileData.originalname), (error) => baseCallback(error, response))
}

app.post('/api/file.get', (request, response) => {
    let url = request.body.url
    if (!url) {
        response.sendStatus(400)
        return
    }

    fileSystem.readFile(url, (error, fileData) => {
        if (error) {response.sendStatus(404)}
        else {response.send(fileData)}
    })
})

app.post('/api/dir.create', (request, response) => {
    let dirUrl = request.body.url
    if (!dirUrl) {
        response.sendStatus(400)
        return
    }

    fileSystem.mkdir(dirUrl, (error) => baseCallback(error, response))
})


app.post('/api/dir.remove', (request, response) => {
    let dirUrl = request.body.url
    if (!dirUrl) {
        response.sendStatus(400)
        return
    }    

    fileSystem.rmdir(dirUrl, {"recursive": true}, (error) => baseCallback(error, response))
})

app.post('/api/dir.get', (request, response) => {
    let url = request.body.url
    if (!url) {
        res.sendStatus(400)
        return
    }

    fileSystem.readdir(url, (error, files) => {
        if (error) {
            response.sendStatus(500)
            return
        }
        let out = []

        for (let fileName of files) {
            let stats = fileSystem.statSync(path.join(url, fileName))

            out.push({
                "name": fileName,
                "isDir": stats.isDirectory()
            })
        }
        response.send(out)
    })
})
app.post('/api/dir.download', (request, response) => {
    let url = request.body.url
    let zip = new AdmZip()
    zip.addLocalFolder(url)
    response.send(zip.toBuffer())
})


// Listening
app.listen(config.port, () => {
    console.log("Webadmin listening on port " + config.port)
})


// Functions
function baseCallback(error, response) {
    if (error) {response.sendStatus(500)}
    else {response.end()}
}
