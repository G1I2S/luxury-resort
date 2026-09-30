import { useEffect, useState } from 'react';
import client from '../api/client';
import RoomCarousel from '../components/RoomCarousel.jsx';

const CATEGORIES = [
  { key: 'suite', title: 'Suites', subtitle: 'Elegancia íntima en el corazón del resort' },
  { key: 'villa', title: 'Villas', subtitle: 'Espacios privados con vistas excepcionales' },
  {
    key: 'otros',
    title: 'Residencias y Penthouse',
    subtitle: 'Experiencias exclusivas fuera de lo convencional',
  },
];

function groupByCategory(rooms) {
  return CATEGORIES.map((category) => ({
    ...category,
    rooms:
      category.key === 'otros'
        ? rooms.filter((r) => !['suite', 'villa'].includes(r.type))
        : rooms.filter((r) => r.type === category.key),
  }));
}

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [guests, setGuests] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (guests) params.guests = guests;

    client
      .get('/rooms', { params })
      .then(({ data }) => setRooms(data))
      .finally(() => setLoading(false));
  }, [guests]);

  const groups = groupByCategory(rooms);

  return (
    <div className="section">
      <div className="rooms-header">
        <div>
          <h1>Villas y Residencias</h1>
          <p className="section__subtitle" style={{ textAlign: 'left', margin: 0 }}>
            Explora nuestro catálogo de espacios privados
          </p>
        </div>
        <label className="filter">
          Huéspedes mínimos
          <input
            type="number"
            min="1"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            placeholder="Ej: 2"
          />
        </label>
      </div>

      {loading ? (
        <p>Cargando habitaciones...</p>
      ) : (
        groups.map((group) => (
          <RoomCarousel key={group.key} title={group.title} subtitle={group.subtitle} rooms={group.rooms} />
        ))
      )}
    </div>
  );
}
