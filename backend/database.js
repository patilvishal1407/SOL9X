const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sol9x';

async function connectMongo() {
  try {
    await mongoose.connect(MONGO_URI, {
      dbName: 'sol9x',
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
}

module.exports = { connectMongo };
