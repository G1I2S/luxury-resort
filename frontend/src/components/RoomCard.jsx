import { Link } from 'react-router-dom';
import { GuestsIcon } from './Icons.jsx';

export default function RoomCard({ room }) {
  return (
    <article className="room-card">
      <img src={room.image_url} alt={room.name} className="room-card__image" />
      <div className="room-card__body">
        <div className="room-card__meta">
          <span className="pill">{room.type}</span>
          <span className="stat">
            <GuestsIcon /> {room.capacity} huéspedes
          </span>
        </div>
        <h3>{room.name}</h3>
        <p className="room-card__description">{room.description}</p>
        <div className="room-card__footer">
          <span className="room-card__price">${Number(room.price_per_night).toLocaleString()} / noche</span>
          <Link to={`/habitaciones/${room.id}`} className="btn btn--primary">
            Ver detalles
          </Link>
        </div>
      </div>
    </article>
  );
}
