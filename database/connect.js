
const { MongoClient } = require('mongodb');

let _db = null;

// Initialize a mongoDB connection
const initDb = async (callback) => {
  if (_db) {
    console.log('Database already running');
    return callback(null);
  }
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect().catch((err) => {
    callback(err);
  });
  _db = client;
  callback(null);
};

// Returns the connection string
const getDb = () => {
  if (!_db) {
    console.log('Connection to database is not established');
  }
  return _db;
};

module.exports = { initDb, getDb };
