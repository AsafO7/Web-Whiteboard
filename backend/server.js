const express = require('express')
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

connectDB()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(cors())
app.use(errorHandler);

app.use('/lobby', lobbyRoutes)
app.use('/rooms', roomsRoutes)

app.post('/', async (req, res) => {
    const { name, email, currentRoom } = req.body
    try {
        if(email && name) {
            let onlineUsersList = []
            const userCurrRoom = await Room.findOne({ currentRoom })
            if(userCurrRoom) {
                onlineUsersList = userCurrRoom.onlineUsers
                onlineUsersList = onlineUsersList.filter((roomUser) => roomUser !== name)
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

// const port = process.env.PORT || 5000
app.listen(process.env.PORT, () => console.log("Listening on port 5000"));