const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');
// "mongodb+srv://nsph:nsph%40123@nsph.5a73bwd.mongodb.net/?retryWrites=true&w=majority"
const connectDB = async () => {
  try {
    await mongoose.connect(
      db,
      {
        useNewUrlParser: true
      }
    );

    console.log('MongoDB is Connected...');
  } catch (err) {
    console.log("error is", err)
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;