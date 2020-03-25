function getFiles(url) {
    let apiName = "dir.get"
    let data = {"url": url}

    sendApiReq(apiName, data, (data) => {
        curDir = url
        putToContainer(data)
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
    }, () => {
        showNotification(locales[locale]["errorReadingFile"], true)
    })
}

function putToContainer(data) {
    let count = 1
    $container.empty()
    $currentUrl.text(curDir)
    for (let fileData of data) {
        if (fileData.isDir) {
            $container.append(`
                <div class="element directory" onClick="getFiles('${curDir + fileData.name}/')">
                    <span class="counter">
                        ${count++}
                    </span>

                    ${fileData.name}

                    <div class="removeTrigger">
                        <button class="removeButton" title="${locales[locale]["removeFolderTitle"]}" onClick="event.stopPropagation(); removeDir('${curDir + fileData.name}')">
                            -
                        </button>
                    </div>
                </div>
            `)
        } else {
            $container.append(`
                <div class="element file" onClick="readFile('${curDir + fileData.name}')">
                    <span class="counter">
                        ${count++}
                    </span>

                    ${fileData.name}

                    <div class="removeTrigger">
                        <button class="removeButton" title="${locales[locale]["removeFileTitle"]}" onClick="event.stopPropagation(); removeFile('${curDir + fileData.name}')">
                            -
                        </button>
                    </div>
                </div>
            `)
        }
    }
    if (data.length == 0) {
        $container.append(`<h2 style='text-align: center; margin-top: 10px;'>${locales[locale]["epmtyFolderText"]}</h2>`)
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

function showHeader() {
    $(".header").addClass("header-on")
}

function hideHeader() {
    $(".header").removeClass("header-on")
}
