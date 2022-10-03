const express = require('express')
const dotenv = require('dotenv')
dotenv.config()
const cors = require('cors')
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');
const lobbyRoutes = require('./routes/lobbyRoutes')
const User = require('./models/User')
const path = require('path')

connectDB()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(cors())
app.use(errorHandler);

app.use('/lobby', lobbyRoutes)

app.post('/', async (req, res) => {
    const { name, email } = req.body
    try {
        const update = { isLoggedIn: false }
        await User.findOneAndUpdate(email, update)
        res.status(201).send({ name })
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