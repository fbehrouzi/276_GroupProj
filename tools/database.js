
// database.js
// Description: provide connection to database

// Database
const { Pool } = require('pg')
var pool = new Pool({
	connectionString: process.env.DATABASE_URL
	
	//Michael's local testing because I can't read my .env file
	//connectionString:'postgres://myuser:password@localhost:5432/userdb'

})

// Export variable 'pool'
module.exports = {
	pool: pool
}

// End of database.js
