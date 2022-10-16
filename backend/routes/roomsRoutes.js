const express = require('express')
const router = express.Router()
const { createRoom, getRoomInfo, updateOnlineUsersRoom } = require('../controllers/roomsController')

router.route('/').post(createRoom).put(updateOnlineUsersRoom)
router.route('/:id').get(getRoomInfo)

module.exports = router