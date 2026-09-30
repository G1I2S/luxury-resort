import { useEffect, useState } from 'react';
import client from '../api/client';
import RoomCard from '../components/RoomCard.jsx';

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    client.get('/rooms').then(({ data }) => setFeatured(data.slice(0, 3)));
  }, []);

  return (
    <div>
      <section className="hero hero--brand">
        <h1 className="hero__brand-title">Luxury Resort</h1>
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
