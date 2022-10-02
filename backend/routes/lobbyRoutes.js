const express = require('express')
const router = express.Router()
const { loginUser, getLobbyInfo } = require('../controllers/lobbyController')

router.route('/').post(loginUser).get(getLobbyInfo)

module.exports = router
