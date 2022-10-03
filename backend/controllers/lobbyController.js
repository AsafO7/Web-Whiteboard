const bcrypt = require('bcrypt');
const User = require('../models/User')

const getLobbyInfo = async (req, res) => {
    // Send the rooms' info here
    // const players = await Player.find({}).sort({score: -1, name: -1}).limit(10)
    // res.status(200).json(players)
    try {
        const onlineList = await User.find({ isLoggedIn: true }).select('name').exec()
        res.status(201).send(onlineList)
    }
    catch(err) {
        res.status(200).send("Something went wrong getting the list")
    }
}

const loginUser = async (req, res) => {
    // If you don't use the return statement after sending a response, the rest of the function will keep running.
    const { name, email, password } = req.body
    if(!name || !email || !password) {
        res.status(200).send('Please fill all fields')
        return
    }

    // Email validation
    let validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if(!email.match(validRegex)) {
        res.status(200).send('Invalid email')
        return
    }

    // Password validation
    if(password.length < 6) {
        res.status(200).send('Password must be at least 6 characters long')
        return
    }

    // Name validation
    if(name.length > 20) {
        res.status(200).send("Name can't be longer than 20 characters")
        return
    }

    try {
        // Check if user exists
        const userExistsEmail = await User.findOne({ email })
        const userExistsName = await User.findOne({ name })
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        
        // Email exists, check for correct input (username or password might be wrong)
        if(userExistsEmail) {
            if(userExistsEmail.isLoggedIn === true) {
                res.status(200).send("User is logged in already")
                return
            }

            if(userExistsEmail.name !== name) { 
                res.status(200).send("Wrong username")
                return
            }
            else if(await bcrypt.compare(password, userExistsEmail.password)) {
                const update = { isLoggedIn: true }
                await User.findOneAndUpdate(email, update)
                res.status(201).send({name, email})
                return
            }
            else { 
                res.status(200).send("Wrong password")
                return
            }
        }

        // Username exists, client should choose a different one
        if(userExistsName) {
            if(userExistsName.name === name) {
                res.status(200).send("Username already exists")
                return
            }   
        }

        // Create new user
        const user = await User.create({
            name: name,
            email: email,
            password: hashedPassword,
            currentRoom: "",
            isLoggedIn: true,
        })
        
        if (user) {
            res.status(201).send({name, email})
            return
        }
        else {
            res.status(200).send('Invalid user data')
            return
        }
    }
    catch(err) {
        res.status(400)
        throw new Error(err)
    }
}

module.exports = { loginUser, getLobbyInfo }