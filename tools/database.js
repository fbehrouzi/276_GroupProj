
// database.js
// Description: provide connection to database

// Database
const { Pool } = require('pg')
var pool = new Pool({
	//connectionString:'postgres://myuser:password@localhost:5432/userdb'
	connectionString: process.env.DATABASE_URL
})

// Export variable 'pool'
module.exports = {
	pool: pool
}

// End of database.js
