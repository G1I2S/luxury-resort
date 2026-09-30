import { useEffect, useState } from 'react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext.jsx';
import { GuestsIcon, CalendarIcon, HomeIcon, TagIcon } from '../components/Icons.jsx';
import { formatDate } from '../utils/date.js';

export default function MyReservations() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  function loadReservations() {
    setLoading(true);
    client
      .get('/reservations/me')
      .then(({ data }) => setReservations(data))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadReservations();
  }, []);

  async function handleCancel(id) {
    await client.delete(`/reservations/${id}`);
    loadReservations();
  }

  if (loading) return <p className="section">Cargando tus reservas...</p>;

  const active = reservations.filter((r) => r.status !== 'cancelled');
  const next = [...active].sort((a, b) => new Date(a.check_in) - new Date(b.check_in))[0];

  return (
    <div className="section">
      <div className="guest-portal__header">
        <h1>Bienvenido{user?.name ? `, ${user.name}` : ''}</h1>
        <p className="section__subtitle" style={{ textAlign: 'left', margin: 0 }}>
          Aquí tienes el resumen de tus reservas
        </p>
      </div>

      <div className="stat-feature">
        {next ? (
          <>
            <img src={next.image_url} alt={next.room_name} />
            <div className="stat-feature__body">
              <div className="stat-card__header">
                <span>Próxima reserva</span>
                <HomeIcon />
              </div>
              <h3>{next.room_name}</h3>
              <p>{next.room_description}</p>
            </div>
          </>
        ) : (
          <div className="stat-feature__body">
            <div className="stat-card__header">
              <span>Próxima reserva</span>
              <HomeIcon />
            </div>
            <h3>Aún no tienes reservas</h3>
            <p>Explora nuestras villas y residencias para reservar tu próxima estadía.</p>
          </div>
        )}
      </div>

      <div className="stat-cards">
        <div className="stat-card">
          <div className="stat-card__header">
            <span>Fechas</span>
            <CalendarIcon />
          </div>
          {next ? (
            <div className="date-range">
              <span>{formatDate(next.check_in)}</span>
              <span className="date-range__arrow">→</span>
              <span>{formatDate(next.check_out)}</span>
            </div>
          ) : (
            <span className="stat-card__value">—</span>
          )}
        </div>

        <div className="stat-card">
          <div className="stat-card__header">
            <span>Huéspedes</span>
            <GuestsIcon />
          </div>
          <span className="stat-card__value">{next ? next.guests : '—'}</span>
        </div>

        <div className="stat-card">
          <div className="stat-card__header">
            <span>Reservas activas</span>
            <TagIcon />
          </div>
          <span className="stat-card__value">{active.length}</span>
        </div>
      </div>

      <div className="guest-portal__layout">
        <div>
          <h2 className="guest-portal__section-title">Tus reservas</h2>

          {reservations.length === 0 ? (
            <p>Todavía no tienes reservas.</p>
          ) : (
            <div className="timeline">
              {reservations.map((r) => (
                <div key={r.id} className="timeline-item">
                  <div className="timeline-item__dot" />
                  <div className={`timeline-item__card reservation-card--${r.status}`}>
                    <img src={r.image_url} alt={r.room_name} />
                    <div>
                      <h3>{r.room_name}</h3>
                      <p>
                        {formatDate(r.check_in)} → {formatDate(r.check_out)} · {r.guests} huéspedes
                      </p>
                      <p>Total: ${Number(r.total_price).toLocaleString()}</p>
                      <span className={`badge badge--${r.status}`}>{r.status}</span>
                    </div>
                    {r.status !== 'cancelled' && (
                      <button className="btn btn--ghost" onClick={() => handleCancel(r.id)}>
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="concierge-card">
          <div className="concierge-card__avatar">AI</div>
          <h3>Atención Personalizada</h3>
          <p className="concierge-card__name">Alejandro Ibarra</p>
          <p className="concierge-card__role">Gerente de Experiencia del Huésped</p>
          <p>
            {next
              ? `Seré tu contacto directo durante tu estadía en ${next.room_name}, del ${formatDate(next.check_in)} al ${formatDate(next.check_out)}. Escríbeme si necesitas coordinar algo especial.`
              : 'Cuando confirmes tu primera reserva, seré tu contacto directo para coordinar todo lo que necesites durante tu estadía.'}
          </p>
          <a href="mailto:giselaastudillo50@gmail.com" className="btn btn--primary btn--block">
            Enviar mensaje
          </a>
        </div>
      </div>
    </div>
  );
}
