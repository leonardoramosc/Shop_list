const mysql = require('promise-mysql');

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '25413548',
	database: 'electron_app'
});

const getConnection = () => {
	return connection;
}

module.exports = { getConnection }