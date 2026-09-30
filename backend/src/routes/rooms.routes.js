const express = require('express');
const { getAllRooms, getRoomById } = require('../controllers/rooms.controller');

const router = express.Router();

router.get('/', getAllRooms);
router.get('/:id', getRoomById);

module.exports = router;
