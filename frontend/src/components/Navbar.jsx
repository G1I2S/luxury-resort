import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <header className="navbar">
      <Link to="/" className="navbar__brand">
        Luxury Resort
      </Link>
      <nav className="navbar__links">
        <Link to="/habitaciones">Habitaciones</Link>
        {isAuthenticated ? (
          <>
            <Link to="/mis-reservas">Mis reservas</Link>
            <span className="navbar__user">Hola, {user.name}</span>
            <button className="btn btn--ghost" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Iniciar sesión</Link>
            <Link to="/registro" className="btn btn--primary">
              Registrarse
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
