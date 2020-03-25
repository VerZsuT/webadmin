const locales = {
    "ru": {
        "localeName": "ru",
        "pageTitle": "Файловый менеджер",
        "goBeforeTitle": "назад",
        "createFileTitle": "создать",
        "uploadFileTitle": "загрузить",
        "editorSaveTitle": "сохранить файл",
        "editorSaveText": "СОХРАНИТЬ",
        "editorExitTitle": "закрыть редактор",
        "dialogExitTitle": "закрыть диалог создания",
        "dialogTitleText": "Создание",
        "dialogInputText": "Имя",
        "typeFileText": "Файл",
        "typeFileTitle": "файл",
        "typeDirText": "Папка",
        "typeDirTitle": "папка",
        "dialogButtonTitle": "создать файл",
        "dialogButtonText": "Создать"
    },
    "en": {
        "localeName": "en",
        "pageTitle": "File Manager",
        "goBeforeTitle": "back",
        "createFileTitle": "create",
        "uploadFileTitle": "upload",
        "editorSaveTitle": "save file",
        "editorSaveText": "SAVE",
        "editorExitTitle": "close editor",
        "dialogExitTitle": "close creation dialog",
        "dialogTitleText": "Creation",
        "dialogInputText": "Name",
        "typeFileText": "File",
        "typeFileTitle": "file",
        "typeDirText": "Folder",
        "typeDirTitle": "folder",
        "dialogButtonTitle": "create file",
        "dialogButtonText": "Create"
    }
}

function locale(localeName, data) {
    for (let key in locales[localeName]) {
        while (data.indexOf(`{_${key}_}`) != -1) {
            data = data.replace(`{_${key}_}`, locales[localeName][key])
        }
    }
    return data
}

module.exports = locale