const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter a name"],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        dropDups: true,
    },
    password: {
        type: String,
        required: [true, "Please enter a password"],
    },
    currentRoom: {
        type: String,
        default: ""
    },
    isLoggedIn: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model("User", userSchema)