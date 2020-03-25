document.body.onload = () => {
    getFiles("/")
}

fileInput.onchange = (event) => {
    event.stopPropagation()
    event.preventDefault()

    let file = fileInput.files[0]
    let data = new FormData()
    data.append("file", file)
    data.append("dirUrl", curDir)

    $.ajax({
        url: "/api/file.upload",
        type: "POST",
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        success: () => {
            showNotification(locales[locale]["successUploadFileText"])
            getFiles(curDir)
        },
        error: () => {
            showNotification(locales[locale]["errorUploadFileText"], true)
        }
    })
}

$uploadFile.click(() => {
    fileInput.click()
})

$textArea.on("scroll", () => {
    $linesCount.scrollTop($textArea.scrollTop())
})

$textArea.on("input", () => {
    updateCount($textArea.val())
})

$textArea.keydown((e) => {
    if (e.ctrlKey && e.keyCode == 83) {
        e.preventDefault()
        $editorSave.click()
    } else if(e.keyCode == 9) {
        e.preventDefault()
        insertText("    ")
    } else if(e.keyCode == 13) {
        e.preventDefault()
        insertText("\n")
        updateCount($textArea.val())
    }
})

$createFile.click(() => {
    showHeader()
    showCreationDialog()
})

$goBefore.click(() => {
    if (curDir != "/") {
        let beforeUrl = curDir.slice(0, curDir.slice(0, curDir.length - 1).lastIndexOf('/') + 1) || "/"
        getFiles(beforeUrl)
    }
})

$dialogButton.click(() => {
    let fileName = $dialogInput.val()
    if (!fileName) {
        showNotification(locales[locale]["emptyNameErrorText"], true)
        return
    }

    let isFileCreation = typeFile.checked
    let fileUrl = curDir + fileName
    let apiName = isFileCreation ? "file.create" : "dir.create"
    let data = {"url": fileUrl}

    sendApiReq(apiName, data, () => {
        if (isFileCreation) {
            showNotification(locales[locale]["successCreateFileText"])
        } else {
            showNotification(locales[locale]["successCreateFolderText"])
        }
        hideCreationDialog()
        hideHeader()
    }, () => {
        if (isFileCreation) {
            showNotification(locales[locale]["errorCreateFileText"], true)
        } else {
            showNotification(locales[locale]["errorCreateFolderText"], true)
        }
    })
})

$dialogExit.click(() => {
    hideCreationDialog()
    hideHeader()
})

new ResizeObserver(resizeLinesCount).observe(textArea)

$editorExit.click(() => {
    $editor.hide()
    editingFIleUrl = ""
    $linesCount.empty()
    $textArea.empty()
    $editorHeader.empty()
    hideHeader()
})

$editorSave.click(() => {
    let fileData = $textArea.val()
    let apiName = "file.save"
    let data = {
        "fileData": fileData,
        "url": editingFileUrl
    }

    sendApiReq(apiName, data, () => {
        showNotification(locales[locale]["successSaveFileText"])
    }, () => {
        showNotification(locales[locale]["errorSaveFileText"], true)
    })
})