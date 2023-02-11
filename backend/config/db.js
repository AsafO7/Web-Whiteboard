const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.MONGO_URI, () => console.log("Connected to database"))
  } catch (error) {
    console.log(error)
    // process.exit(1)
  }
}

module.exports = connectDB
