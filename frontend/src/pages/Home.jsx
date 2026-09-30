import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import RoomCard from '../components/RoomCard.jsx';

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    client.get('/rooms').then(({ data }) => setFeatured(data.slice(0, 3)));
  }, []);

  return (
    <div>
      <section className="hero">
        <div className="hero__content">
          <span className="hero__eyebrow">Luxury Resort</span>
          <h1>Santuario Privado, Serenidad Absoluta</h1>
          <p>
            Villas y suites exclusivas, personalización a tu medida y una experiencia de hospedaje
            diseñada en torno a ti.
          </p>
          <Link to="/habitaciones" className="btn btn--primary btn--lg">
            Explorar villas
          </Link>
        </div>
      </section>

      <section className="section">
        <h2 className="section__title">Villas destacadas</h2>
        <p className="section__subtitle">Cada espacio, curado para tu privacidad y confort.</p>
        <div className="room-grid">
          {featured.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </section>
    </div>
  );
}
