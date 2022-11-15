const express = require('express')
const app = express()
const dotenv = require('dotenv')
dotenv.config(/*{ path: 'ENV_FILENAME' }*/)
const cors = require('cors')
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');
const lobbyRoutes = require('./routes/lobbyRoutes')
const roomsRoutes = require('./routes/roomsRoutes')
const User = require('./models/User')
const path = require('path');
const Room = require('./models/Room');
const http = require('http');
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
})

connectDB()

app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(cors())
app.use(errorHandler);

app.use('/lobby', lobbyRoutes)
app.use('/room', roomsRoutes)

app.post('/', async (req, res) => {
    const { name, email, currentRoom } = req.body
    try {
        if(email && name) {
            let onlineUsersList = []
            const userCurrRoom = await Room.findOne({ currentRoom })
            // Remove user from the room they were in
            if(userCurrRoom) {
                onlineUsersList = userCurrRoom.onlineUsers
                onlineUsersList = onlineUsersList.filter((roomUser) => roomUser !== name)
                console.log(onlineUsersList)
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
            // Change state in database
            await User.updateOne({ email }, {
                $set: { 
                  isLoggedIn: false,
                  currentRoom: "",
                }
            }).clone()
            res.status(201).send({ name })
            console.log("logout successful")
        }
    }
    catch(err) {
        res.status(200).send("Something went wrong")
    }
})

// Server frontend
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/build')));

    app.get('*', (req, res) =>
        res.sendFile(
        path.resolve(__dirname, '../', 'frontend', 'build', 'index.html')
        )
    );
} 
else {
    app.get('/', (req, res) => res.send('Please set to production'));
}

/* when user connects, add them to the onlineUsers array in the rooms array of their specific room, and from the front-end, send an event to add them
to the rooms array of the other users in the room. (Send the event in OnlineUsers.tsx after adding the user)

when they disconnect, remove them from the onlineUsers array in the rooms array of their specific room, and from the front-end, send an event to remove them
from the rooms array of the other users in the room. */

let rooms = []
let users = []
let roomId = ""
io.on("connection", socket => {
    socket.on("user-login", async (user) => {
        const newUser = {username: user.name, socketId: socket.id}
        // let duplicateUser = false
        // const dupUser = await users.find(e => e.username === user.name)
        // if(dupUser) duplicateUser = true

        // const userRoom = await Room.findOne({ roomId })
        // array will be correct when user enters a room. in creation it'll be empty.
        // if(userRoom) {
        //     users = userRoom.onlineUsers
        // }

        // if(!duplicateUser) {
            users.push(newUser)
            roomId = user.currentRoom
            console.log(users, roomId, "from: " + user.name)
            socket.join(user.currentRoom)
            console.log(`${user.name} joined the room`)
            socket.to(roomId).emit("add-user-to-list", user.name, roomId)
        // }
    })
    socket.on("disconnect", () => {
        const userToSend = users.find(user => user.socketId === socket.id)
        // console.log(userToSend)
        if(!userToSend) return
        users = []
        socket.leave(roomId)
        console.log(`${userToSend.username} left the room`)
        socket.to(roomId).emit("logout-user", userToSend.username)
        roomId = ""
    })
})

// const port = process.env.PORT || 5000
server.listen(process.env.PORT, () => console.log("Listening on port 5000"));