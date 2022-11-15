const Room = require("../models/Room")
const User = require('../models/User')

const createRoom = async (req, res) => {
    const { userName, roomName, roomId } = req.body
    // To check if roomName is just empty spaces
    const rName = roomName.trim()
    if(roomName === "" || rName === "") {
        res.status(200).send("Room must have a name")
        return
    }
    const tempRoom = await Room.findOne({ name: roomName })
    if(tempRoom) {
        res.status(200).send("This room already exists")
        return
    }
    if(userName === "") {
        res.status(200).send("Please log in first")
        return
    }
    try {
        const room = await Room.create({
            name: rName,
            id: roomId,
            userWhoOpened: userName,
            onlineUsers: [userName],
            drawingHistory: [],
        })
        if(room) {
            await User.updateOne({ name: userName }, {
                $set: {
                    currentRoom: roomId
                }
            }).clone()
            res.status(201).send({room})
        }
        else {
            res.status(200).send("Couldn't open a room, please try again")
        }
    }
    catch(err) {
        throw new Error(err)
    }
}

// Finds the room with roomId, updates its online users with username, updates currentRoom of username, and returns the room
const getRoomInfo = async (req, res) => {
    const { roomId, username } = req.query
    if(username === "") {
        res.status(200).send("Please log in first")
        return
    }
    try {
        const room = await Room.findOne({ roomId }).exec()
        if(room) {
            // if the user isn't in the online users list of the room
            if(room.onlineUsers.indexOf(username) === -1) {
                let newOnlineUsers = room.onlineUsers
                newOnlineUsers.push(username)
                await Room.updateOne({ id: roomId }, {
                    $set: { 
                        onlineUsers: newOnlineUsers
                    }
                }).clone()
                
                await User.updateOne({ name: username }, {
                    $set: {
                        currentRoom: roomId
                    }
                }).clone()
            }
            res.status(201).send(room)
        }
        else {
            res.status(200).send("Something went wrong, please refresh")
        }
    }
    catch(err) {
        throw new Error(err)
    }
}

// Updates the online users of currRoom when a user leaves, and updates currentRoom of user
const updateOnlineUsersRoom = async (req, res) => {
    const { name, email, currentRoom } = req.body
    if(name === "") {
        res.status(200).send("Please log in first")
        return
    }
    // Update online users for rooms
    try {
        let onlineUsersList = []
        const currUser = await User.findOne({ email })
        const userCurrRoom = await Room.findOne({ currentRoom })
        // found the user and their previous room
        if(currUser && userCurrRoom) {
            // found the room
            onlineUsersList = userCurrRoom.onlineUsers.filter((roomUser) => roomUser !== name)
            if(onlineUsersList.length === 0) {
                // Delete the room
                await Room.deleteOne({ currentRoom }).clone()
            }
            else {
                await Room.updateOne({ currentRoom }, {
                    $set: {
                        onlineUsers: onlineUsersList
                    }
                }).clone()
            }
        }
        await User.updateOne({ email: email }, {
            $set: {
                currentRoom: ""
            }
        }).clone()
        res.status(201).send({currentRoom})
    }
    catch(err) {
        res.status(200).send(err)
    }
}

module.exports = { createRoom, getRoomInfo, updateOnlineUsersRoom }