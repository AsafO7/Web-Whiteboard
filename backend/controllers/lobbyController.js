const bcrypt = require('bcrypt');
const User = require('../models/User')
const Room = require('../models/Room')

// Returns the rooms list and the user's info except password
const getLobbyInfo = async (req, res) => {
    const { name, email } = req.query
    try {
        if(name === "") {
            res.status(200).send("Please log in first")
            return
        }
        const user = await User.findOne({ email: email })
        if(user.isLoggedIn === false) {
            await User.updateOne({ email: email }, {
                $set: { 
                  isLoggedIn: true,
                  currentRoom: "",
                }
            }).clone()
            console.log("login successful")
        }
        const rooms = await Room.find({})
        res.status(201).send({name, email, rooms})
        return
    }
    catch(err) {
        console.log(err)
        res.status(200).send("Something went wrong getting the list")
    }
}

const loginUser = async (req, res) => {
    // If you don't use the return statement after sending a response, the rest of the function will keep running.
    const { name, email, password } = req.body
    const validationMsg = validateUser(name, email, password)
    if(validationMsg) {
        res.status(200).send(validationMsg)
        return
    }

    try {
        // Check if user exists
        const userExistsEmail = await User.findOne({ email: email })
        const userExistsName = await User.findOne({ name: name })
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
                await User.updateOne({ email: email }, {
                    $set: { 
                      isLoggedIn: true
                    }
                }).clone()
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

function validateUser(name, email, password) {
    if(!name || !email || !password) return 'Please fill the all fields'

    // Email validation
    let validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if(!email.match(validRegex)) return 'Invalid email'

    // Password validation
    if(password.length < 6) return 'Password must be at least 6 characters long'

    // Name validation
    if(name.length > 20) return "Name can't be longer than 20 characters"

    return ""
}

module.exports = { loginUser, getLobbyInfo }