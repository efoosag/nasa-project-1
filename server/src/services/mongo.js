const mongoose = require('mongoose');

require('dotenv').config();

const MONGODB_URL = process.env.MONGODB_URL;

mongoose.connection.once('open', () => {
  console.log('MongoDB connection ready!');
});

mongoose.connection.on('error', (err) => {
  console.error(err);
});

async function mongoConnect() {
  await mongoose.connect(MONGODB_URL);  
}

module.exports = {
  mongoConnect, 
}