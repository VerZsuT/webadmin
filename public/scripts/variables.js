const $container = $("#container")
const $currentUrl = $("#currentUrl")
const $goBefore = $("#goBefore")
const $createFile = $("#createFile")
const $uploadFile = $("#uploadFile")

const $editor = $("#editor")
const $editorHeader = $("#editorHeader")
const $editorSave = $("#editorSave")
const $editorExit = $("#editorExit")
const $textArea = $("#textArea")
const $linesCount = $("#linesCount")

const $creationDialog = $("#creationDialog")
const $dialogExit = $("#dialogExit")
const $dialogInput = $("#dialogInput")
const $dialogButton = $("#dialogButton")
const textArea = document.getElementById("textArea")
const typeFile = document.getElementById("typeFile")
const fileInput = document.getElementById("fileInput")

const locale = document.body.lang
var curDir = "/"
var editingFileUrl = ""