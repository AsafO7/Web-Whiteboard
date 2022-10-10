const express = require('express')
const router = express.Router()
const { loginUser, getLobbyInfo, logReturningUser } = require('../controllers/lobbyController')

router.route('/').post(loginUser).get(getLobbyInfo)

module.exports = router
