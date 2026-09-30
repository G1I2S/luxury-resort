const express = require('express');
const verifyToken = require('../middleware/auth.middleware');
const {
  createReservation,
  getMyReservations,
  cancelReservation,
} = require('../controllers/reservations.controller');

const router = express.Router();

router.use(verifyToken);

router.post('/', createReservation);
router.get('/me', getMyReservations);
router.delete('/:id', cancelReservation);

module.exports = router;
