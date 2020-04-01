function getFiles(url) {
    let apiName = "dir.get"
    let data = {"url": url}

    sendApiReq(apiName, data, (data) => {
        curDir = url
        putToContainer(data)
        $container.scrollTop(0)
    }, () => {
        showNotification(locales[locale]["folderReadError"], true)
    })
}

function readFile(url) {
    let apiName = "file.get"
    let data = {"url": url}

    sendApiReq(apiName, data, (fileData) => {
        editingFileUrl = url
        showEditFile(fileData)
        $textArea.scrollTop(0)
    }, () => {
        showNotification(locales[locale]["errorReadingFile"], true)
    })
}

function downloadFile(url, fileName, isFile=true) {
    $.ajax({
	url: `/api/${isFile ? 'file.get' : 'dir.download'}`,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            'url': url,
            'accessCode': getCookies().accessCode
        }),
	dataType: 'binary',
	xhrFields: {
	    'responseType': 'blob'
	},
	success: function(data, status, xhr) {
	    var blob = new Blob([data], {type: xhr.getResponseHeader('Content-Type')});
	    var link = document.createElement('a');
	    link.href = window.URL.createObjectURL(blob);
	    link.download = isFile ? fileName : fileName + '.zip';
	    link.click();
	}
    });
}

function putToContainer(data) {
    let count = 1
    $container.empty()
    $currentUrl.text(curDir)
    if (data.length == 0) {
        $container.append(`<h2 style='text-align: center; margin-top: 10px;'>${locales[locale]["emptyFolderText"]}</h2>`)
    } else {
        // Adding folders
        for (let fileData of data) {
            if (fileData.isDir) {
                let dirUrl = curDir + fileData.name + '/'
                let dirName = fileData.name
                createDirElement(dirUrl, dirName, count++)
            }
        }
        // Adding files
        for (let fileData of data) {
            if (!fileData.isDir) {
                let fileUrl = curDir + fileData.name
                let fileName = fileData.name
                createFileElement(fileUrl, fileName, count++)
            }
        }
    }
}

function showEditFile(fileData) {
    updateCount(fileData)
    $textArea.val(fileData)
    $editorHeader.text(editingFileUrl.split("/").pop())
    $editor.show()
    showHeader()
    $textArea.focus()
}

function resizeLinesCount() {
    $linesCount.height($textArea.height())
}

function insertText(text) {
    let start = textArea.selectionStart
    let end = textArea.selectionEnd
    let finText = textArea.value.substring(0, start) + text + textArea.value.substring(end)

    textArea.value = finText
    textArea.focus()
    textArea.selectionEnd = (start == end) ? (end + text.length) : end
}

function updateCount(data) {
    $linesCount.empty()
    let count = data.split("\n").length
    let text = ""

    for (let i = 1; i <= count; i++) {
        text += "<p class='count'>" + i + "</p>"
    }
    $linesCount.append(text + "<div style='height: 50px;'></div>")
}

function removeFile(fileUrl) {
    let success = confirm(`${locales[locale]["removeFileConfirmText"]} '${fileUrl}' ?`)
    if (!success) return

    let apiName = "file.remove"
    let data = {"url": fileUrl}

    sendApiReq(apiName, data, () => {
        showNotification(locales[locale]["successRemoveFileText"])
        getFiles(curDir)
    }, () => {
        showNotification(locales[locale]["errorRemoveFileText"], true)
    })
}

function removeDir(dirUrl) {
    let success = confirm(`${locales[locale]["confirmRemoveDirText"]} '${dirUrl}' ?`)
    if (!success) return

    let apiName = "dir.remove"
    let data = {"url": dirUrl}

    sendApiReq(apiName, data, () => {
        showNotification(locales[locale]["successRemoveDirText"])
        getFiles(curDir)
    }, () => {
        showNotification(locales[locale]["errorRemoveDirText"], true)
    })
}

function sendApiReq(apiName, data, successCallback, errorCallback) {
    let accessCode = getCookies().accessCode
    data.accessCode = accessCode
    $.ajax({
        url: "/api/" + apiName,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: successCallback,
        error: errorCallback
    })
}

function showCreationDialog() {
    $creationDialog.show()
    $dialogInput.focus()
}

function hideCreationDialog() {
    $creationDialog.hide()
    $dialogInput.val('')
    getFiles(curDir)
}

function showNotification(text, isError=false) {
    let notification = document.createElement('div')
    notification.className = "notification"
    if (isError) {
        notification.classList.add("error")
    }

    notification.innerHTML = text
    document.body.append(notification)

    setTimeout(() => notification.remove(), 2000)
}

function createDirElement(dirUrl, dirName, count) {
    let element = document.createElement('div')
    element.className = 'element directory'
    element.onclick = () => {
        getFiles(dirUrl)
    }

    let counter = document.createElement('span')
    counter.className = 'counter'
    counter.innerHTML = count

    let name = document.createElement('span')
    name.innerHTML = dirName

    let removeTrigger = document.createElement('div')
    removeTrigger.className = 'removeTrigger'

    let removeButton = document.createElement('button')
    removeButton.className = 'removeButton'
    removeButton.title = locales[locale]['removeFolderTitle']
    removeButton.onclick = (event) => {
        event.stopPropagation()
        removeDir(dirUrl)
    }
    removeButton.innerHTML = '-'

    let downloadTrigger = document.createElement('div')
    downloadTrigger.className = 'downloadTrigger'

    let downloadButton = document.createElement('button')
    downloadButton.className = 'downloadButton'
    downloadButton.title = locales[locale]['downloadFolderTitle'] || 'download'
    downloadButton.onclick = (event) => {
        event.stopPropagation()
        downloadFile(dirUrl, dirName, false)
    }

    removeTrigger.append(removeButton)
    downloadTrigger.append(downloadButton)
    element.append(counter)
    element.append(name)
    element.append(removeTrigger)
    element.append(downloadTrigger)
    $container.append(element)
}

function createFileElement(fileUrl, fileName, count) {
    let element = document.createElement('div')
    element.className = 'element file'
    element.onclick = () => {
        readFile(fileUrl)
    }

    let counter = document.createElement('span')
    counter.className = 'counter'
    counter.innerHTML = count

    let name = document.createElement('span')
    name.innerHTML = fileName

    let removeTrigger = document.createElement('div')
    removeTrigger.className = 'removeTrigger'

    let removeButton = document.createElement('button')
    removeButton.className = 'removeButton'
    removeButton.title = locales[locale]['removeFileTitle']
    removeButton.onclick = (event) => {
        event.stopPropagation()
        removeFile(fileUrl)
    }
    removeButton.innerHTML = '-'

    let downloadTrigger = document.createElement('div')
    downloadTrigger.className = 'downloadTrigger'

    let downloadButton = document.createElement('button')
    downloadButton.className = 'downloadButton'
    downloadButton.title = locales[locale]['downloadFileTitle']
    downloadButton.onclick = (event) => {
        event.stopPropagation()
        downloadFile(fileUrl, fileName)
    }

    removeTrigger.append(removeButton)
    downloadTrigger.append(downloadButton)
    element.append(counter)
    element.append(name)
    element.append(removeTrigger)
    element.append(downloadTrigger)
    $container.append(element)
}

function getCookies() {
    let cookies = {}
    for (let item of document.cookie.split(';')) {
        let key = item.split('=')[0]
        let value = item.split('=')[1]
        cookies[key] = value
    }
    return cookies
}

function showHeader() {
    $(".header").addClass("header-on")
}

function hideHeader() {
    $(".header").removeClass("header-on")
}
