const pool = require('../config/db');

function nightsBetween(checkIn, checkOut) {
  const msPerNight = 1000 * 60 * 60 * 24;
  return Math.round((new Date(checkOut) - new Date(checkIn)) / msPerNight);
}

async function createReservation(req, res) {
  const { room_id, check_in, check_out, guests } = req.body;
  const userId = req.userId;

  if (!room_id || !check_in || !check_out || !guests) {
    return res.status(400).json({ error: 'room_id, check_in, check_out y guests son obligatorios' });
  }

  if (new Date(check_out) <= new Date(check_in)) {
    return res.status(400).json({ error: 'La fecha de salida debe ser posterior a la de entrada' });
  }

  try {
    const roomResult = await pool.query('SELECT * FROM rooms WHERE id = $1', [room_id]);
    const room = roomResult.rows[0];

    if (!room) {
      return res.status(404).json({ error: 'Habitación no encontrada' });
    }

    if (guests > room.capacity) {
      return res.status(400).json({ error: `Esta habitación admite máximo ${room.capacity} huéspedes` });
    }

    const overlap = await pool.query(
      `SELECT id FROM reservations
       WHERE room_id = $1
       AND status != 'cancelled'
       AND check_in < $3
       AND check_out > $2`,
      [room_id, check_in, check_out]
    );

    if (overlap.rows.length > 0) {
      return res.status(409).json({ error: 'La habitación ya está reservada en esas fechas' });
    }

    const nights = nightsBetween(check_in, check_out);
    const totalPrice = nights * Number(room.price_per_night);

    const result = await pool.query(
      `INSERT INTO reservations (user_id, room_id, check_in, check_out, guests, total_price)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [userId, room_id, check_in, check_out, guests, totalPrice]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear la reserva' });
  }
}

async function getMyReservations(req, res) {
  const userId = req.userId;

  try {
    const result = await pool.query(
      `SELECT r.*, rm.name AS room_name, rm.image_url, rm.type, rm.description AS room_description
       FROM reservations r
       JOIN rooms rm ON rm.id = r.room_id
       WHERE r.user_id = $1
       ORDER BY r.check_in DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener tus reservas' });
  }
}

async function cancelReservation(req, res) {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const result = await pool.query(
      `UPDATE reservations SET status = 'cancelled'
       WHERE id = $1 AND user_id = $2 RETURNING *`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al cancelar la reserva' });
  }
}

module.exports = { createReservation, getMyReservations, cancelReservation };
