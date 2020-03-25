const express = require("express")
const multer = require("multer")
const app = express()
const fs = require("fs")
const locale = require("./locale.js")

const conf = JSON.parse(fs.readFileSync(__dirname + "/conf.json"))

const upload = multer({dest: __dirname + "/temp/"})
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/styles", express.static(__dirname + "/public/styles"))
app.use("/scripts", express.static(__dirname + "/public/scripts"))
app.use("/", (req, res, next) => {
    if (!accept(getIp4(req.ip))) res.sendStatus(400)
    else next()
})

app.get("/", (req, res) => {
    res.redirect("/fileManager")
})

app.get("/fileManager", (req, res) => {
    fs.readFile(__dirname + "/public/fileManager.html", (err, data) => {
        if (err) {
            res.sendStatus(404)
            return
        } else { 
            res.send(locale(conf.localeName, data.toString("utf8")))
        }
    })
})

app.post("/api/file.save", (req, res) => {
    let url = req.body.url
    let fileData = req.body.fileData

    if (!url || !fileData) {
        res.sendStatus(400)
        return
    } else {
        fs.writeFile(url, fileData, (err) => {
	    if (err) {
		res.sendStatus(500)
	    } else {
		res.end()
	    }
        })
    }
})

app.post("/api/file.create", (req, res) => {
    let fileUrl = req.body.url
    if (!fileUrl) {
        res.sendStatus(400)
        return
    }

    fs.writeFile(fileUrl, "", (err) => {
        if (err) res.sendStatus(500)
        else res.end()
    })
})

app.post("/api/file.rename", (req, res) => {
    let curUrl = req.body.url
    let newUrl = req.body.newUrl
    if (!curUrl || !newUrl) {
        res.sendStatus(400)
        return
    }

    fs.rename(curUrl, newUrl, (err) => {
        if (err) res.sendStatus(500)
        else res.end()
    })
})

app.post("/api/file.remove", (req, res) => {
    let fileUrl = req.body.url
    if (!fileUrl) {
        res.sendStatus(400)
        return
    }

    fs.unlink(fileUrl, (err) => {
        if (err) res.sendStatus(500)
        else res.end()
    })
})

app.post("/api/file.upload", upload.single('file'), (req, res) => {
    if (!req.file) {
        res.sendStatus(400)
        return
    }

    let fileData = req.file
    let dirUrl = req.body.dirUrl

    fs.rename(fileData.path, dirUrl + fileData.originalname, (err) => {
        if (err) {res.sendStatus(500); console.log(err)}
        else res.end()
    })
})

app.post("/api/file.get", (req, res) => {
    let url = req.body.url
    if (!url) {
        res.sendStatus(400)
        return
    }

    fs.readFile(req.body.url, (err, data) => {
        if (!err) {
            res.send(data)
        } else {
            res.sendStatus(404)
        }
    })
})

app.post("/api/dir.create", (req, res) => {
    let dirUrl = req.body.url
    if (!dirUrl) {
        res.sendStatus(400)
        return
    }

    fs.mkdir(dirUrl, (err) => {
        if (err) res.sendStatus(500)
        else res.end()
    })
})


app.post("/api/dir.remove", (req, res) => {
    let dirUrl = req.body.url
    if (!dirUrl) {
        res.sendStatus(400)
        return
    }    

    fs.rmdir(dirUrl, {recursive: true}, (err) => {
        if (err) res.sendStatus(500)
        else res.end()
    })
})

app.post("/api/dir.get", (req, res) => {
    let url = req.body.url
    if (!url) {
        res.sendStatus(400)
        return
    }

    fs.readdir(url, (err, files) => {
        if (err) {
            res.sendStatus(500)
            return
        }
        let out = []

        for (let file of files) {
            let stats = fs.statSync(url + file)

            out.push({
                "name": file,
                "isDir": stats.isDirectory()
            })
        }
        res.send(out)
    })
})

app.listen(conf.port, () => {
    console.log("FileManager listening on port " + conf.port)
})

function accept(ip) {
    return conf.acceptIp == ip
}

function getIp4(ip) {
    return ip.split(":").pop()
}
