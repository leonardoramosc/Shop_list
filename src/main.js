/*
 ESTE MODULO SERA EL PROCESO PRINCIPAL, ENCARGADO DE EJECUTAR FUNCIONES RELACIONADAS CON EL SISTEMA OPERATIVO, BASES DE DATOS, ETC.
*/

const { BrowserWindow, Notification } = require('electron');
const { getConnection } = require('./database');

async function createProduct(product){
	try {
		const con = await getConnection();
		product.price = parseFloat(product.price);
		const queryResult = await con.query('INSERT INTO products SET ?', product);

		product.id = queryResult.insertId;

		new Notification({
			title: 'App Notification',
			body: 'Product added succesfully'
		}).show();

		return product;

	} catch(err) {
		console.log(err);
	}
}

async function getProducts() {
	const con = await getConnection();
	const results = await con.query('SELECT * FROM products ORDER BY id DESC');
	return results;
}

async function updateProduct(name, price, desc, id) {
	const con = await getConnection();

	await con.query(`UPDATE products 
					SET name='${name}', price=${price}, description='${desc}'
					WHERE id=${id}
					`)
}

async function deleteProduct(id) {
	const con = await getConnection();
	await con.query(`DELETE FROM products WHERE id=${id}`);
}

const createWindow = () => {
	let window = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
			enableRemoteModule: true
		}
	});

	window.loadFile('./ui/index.html');
}

module.exports = {
	createWindow,
	createProduct,
	getProducts,
	updateProduct,
	deleteProduct
}