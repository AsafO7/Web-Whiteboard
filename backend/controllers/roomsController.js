const Room = require("../models/Room")
const User = require('../models/User')


const createRoom = async (req, res) => {
    const { userName, roomName, roomId } = req.body
    try {
        const room = await Room.create({
            name: roomName,
            id: roomId,
            userWhoOpened: userName,
            onlineUsers: [userName],
            drawingHistory: [],
        })
        if(room) {
            await User.updateOne({ userName }, {
                $set: {
                    "currentRoom": roomId
                }
            }/*, function (err) {
                if(err) throw new Error(err)
                else console.log("updated current room")
            }*/).clone()
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
    try {
        const room = await Room.findOne({ id: roomId }).exec()
        if(room) {
            // if the user isn't in the online users list of the room
            if(room.onlineUsers.indexOf(username) === -1) {
                let newOnlineUsers = room.onlineUsers
                newOnlineUsers.push(username)
                await Room.updateOne({ roomId }, {
                    $set: { 
                        "onlineUsers": newOnlineUsers
                    }
                }/*, function (err) {
                    if (err) throw new Error(err)
                    else console.log("update online users")
                }*/).clone()
                await User.updateOne({ username }, {
                    $set: {
                        "currentRoom": roomId
                    }
                }/*, function(err) {
                    if(err) throw new Error(err)
                    else console.log("update current room")
                }*/).clone()
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
    // Update online users for rooms
    try {
        let onlineUsersList = []
        if(currentRoom !== "") {
            // const room = await Room.findOne({ currRoom })
            // // console.log(room)
            // onlineUsersList = room.onlineUsers
            // // User enters a room
            // if(room) {
            //     onlineUsersList.push(name)
            // }
        }
        // User leaves a room
        else {
            const currUser = await User.findOne({ email })
            // found the user
            if(currUser) {
                // const roomId = currUser.currentRoom
                const userCurrRoom = await Room.findOne({ currentRoom })
                // found the room
                if(userCurrRoom) {
                    onlineUsersList = userCurrRoom.onlineUsers
                    // console.log(onlineUsersList[0] !== name)
                    // console.log(onlineUsersList)
                    onlineUsersList = onlineUsersList.filter((roomUser) => roomUser !== name)
                    // console.log(onlineUsersList)
                    if(onlineUsersList.length === 0) {
                        // Delete the room
                    }
                }
            }
        }
        // console.log(name)
        await Room.updateOne({ currentRoom }, {
            $set: {
                "onlineUsers": onlineUsersList
            }
        }).clone()
        await User.updateOne({ email }, {
            "currentRoom": currentRoom
        }).clone()
        res.status(201).send({currentRoom})
    }
    catch(err) {
        res.status(200).send(err)
        // throw new Error(err)
    }
    // Update current room for user
}

module.exports = { createRoom, getRoomInfo, updateOnlineUsersRoom }