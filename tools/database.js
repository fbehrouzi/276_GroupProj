
// database.js
// Description: provide connection to database

// Database
const { Pool } = require('pg')
// var pool = new Pool({
// 	connectionString: process.env.DATABASE_URL
// })

var pool = new Pool ({
	user: 'postgres',
	host: 'localhost',
	database: 'farmagatchi',
	password: 'root',
	port: 5432
})

// Export variable 'pool'
module.exports = {
	pool: pool
}

// End of database.js
