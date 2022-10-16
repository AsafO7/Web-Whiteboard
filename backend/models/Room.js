const mongoose = require('mongoose')

const roomSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    id: {
        type: String,
        required: true,
        unique: true,
        dropDups: true,
    },
    userWhoOpened: {
        type: String,
        required: true,
    },
    onlineUsers: {
        type: [],
        default: []
    },
    drawingHistory: {
        type: [],
        default: []
    }
})

module.exports = mongoose.model("Room", roomSchema)