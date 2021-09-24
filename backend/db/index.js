if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const { Pool, Client } = require('pg')

// pools will use environment variables for connection information
const pool = new Pool()

module.exports = {
  query: (text, params) => pool.query(text, params)
}
