const pool = require('../config/db');

async function getAllRooms(req, res) {
  const { type, guests } = req.query;

  const conditions = [];
  const values = [];

  if (type) {
    values.push(type);
    conditions.push(`type = $${values.length}`);
  }

  if (guests) {
    values.push(Number(guests));
    conditions.push(`capacity >= $${values.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  try {
    const result = await pool.query(
      `SELECT * FROM rooms ${where} ORDER BY price_per_night ASC`,
      values
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener las habitaciones' });
  }
}

async function getRoomById(req, res) {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM rooms WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Habitación no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener la habitación' });
  }
}

module.exports = { getAllRooms, getRoomById };
