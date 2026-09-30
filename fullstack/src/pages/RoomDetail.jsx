import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext.jsx';
import { GuestsIcon, TagIcon, CompassIcon } from '../components/Icons.jsx';

function nightsBetween(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;
  const msPerNight = 1000 * 60 * 60 * 24;
  const nights = Math.round((new Date(checkOut) - new Date(checkIn)) / msPerNight);
  return nights > 0 ? nights : 0;
}

export default function RoomDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [room, setRoom] = useState(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    client.get(`/rooms/${id}`).then(({ data }) => setRoom(data));
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await client.post('/reservations', {
        room_id: Number(id),
        check_in: checkIn,
        check_out: checkOut,
        guests: Number(guests),
      });
      setSuccess('¡Reserva confirmada! Puedes verla en "Mis reservas".');
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo crear la reserva');
    }
  }

  if (!room) return <p className="section">Cargando...</p>;

  const nights = nightsBetween(checkIn, checkOut);
  const subtotal = nights * Number(room.price_per_night);

  return (
    <div className="section villa-detail">
      <img src={room.image_url} alt={room.name} className="villa-detail__hero" />

      <div className="villa-detail__header">
        <span className="pill">{room.type}</span>
        <h1>{room.name}</h1>
        <p className="room-detail__description">{room.description}</p>
      </div>

      <div className="stats-bar stats-bar--full">
        <div className="stats-bar__item">
          <span>Capacidad</span>
          <span>
            <GuestsIcon /> {room.capacity} huéspedes
          </span>
        </div>
        <div className="stats-bar__item">
          <span>Tipo</span>
          <span>
            <CompassIcon /> {room.type}
          </span>
        </div>
        <div className="stats-bar__item">
          <span>Tarifa</span>
          <span>
            <TagIcon /> ${Number(room.price_per_night).toLocaleString()}/noche
          </span>
        </div>
      </div>

      <div className="villa-layout">
        <div className="villa-content">
          <h2>Sobre esta villa</h2>
          <p className="room-detail__description">{room.description}</p>

          {room.amenities?.length > 0 && (
            <>
              <h2>Comodidades</h2>
              <ul className="amenities">
                {room.amenities.map((amenity) => (
                  <li key={amenity}>{amenity}</li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div className="villa-booking">
          <div className="villa-booking__price">
            <span className="villa-booking__amount">
              ${Number(room.price_per_night).toLocaleString()}
            </span>
            <span className="villa-booking__unit">/ noche</span>
          </div>

          <form className="form villa-booking__form" onSubmit={handleSubmit}>
            <label>
              Check-in
              <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} required />
            </label>

            <label>
              Check-out
              <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} required />
            </label>

            <label>
              Huéspedes
              <input
                type="number"
                min="1"
                max={room.capacity}
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                required
              />
            </label>

            {nights > 0 && (
              <div className="villa-booking__breakdown">
                <div>
                  <span>
                    ${Number(room.price_per_night).toLocaleString()} x {nights} noche{nights > 1 ? 's' : ''}
                  </span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="villa-booking__total">
                  <span>Total estimado</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
              </div>
            )}

            {error && <p className="form__error">{error}</p>}
            {success && <p className="form__success">{success}</p>}

            <button type="submit" className="btn btn--primary btn--lg btn--block">
              Confirmar reserva
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
