/*
ESTE MODULO SERA EL ENCARGADO DE EJECUTAR TODO LO RELACIONADO A LA APLICACION DE ELECTRON
*/
const {app} = require('electron');

const {createWindow} = require('./main.js');
const {getConnection} = require('./database');

require('electron-reload')(__dirname);


app.allowRendererProcessReuse = false;

app.whenReady().then(createWindow);





