import { useRef } from 'react';
import RoomCard from './RoomCard.jsx';

export default function RoomCarousel({ title, subtitle, rooms }) {
  const trackRef = useRef(null);

  function scroll(direction) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.9, behavior: 'smooth' });
  }

  if (rooms.length === 0) return null;

  return (
    <div className="carousel">
      <div className="carousel__header">
        <h2>{title}</h2>
        {subtitle && <p className="section__subtitle" style={{ textAlign: 'left', margin: 0 }}>{subtitle}</p>}
      </div>

      <div className="carousel__body">
        <button
          type="button"
          className="carousel__arrow carousel__arrow--left"
          onClick={() => scroll(-1)}
          aria-label="Anterior"
        >
          ‹
        </button>

        <div className="carousel__track" ref={trackRef}>
          {rooms.map((room) => (
            <div className="carousel__item" key={room.id}>
              <RoomCard room={room} />
            </div>
          ))}
        </div>

        <button
          type="button"
          className="carousel__arrow carousel__arrow--right"
          onClick={() => scroll(1)}
          aria-label="Siguiente"
        >
          ›
        </button>
      </div>
    </div>
  );
}
