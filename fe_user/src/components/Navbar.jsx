import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../css/navbar.css';

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="navbar">
      <NavLink to="/dashboard" className="nav-brand">
        <span className="brand-text">Ghost-Guest</span>
      </NavLink>

      {user && (
        <div className="nav-links">
          <NavLink to="/dashboard" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Dashboard
          </NavLink>
          <NavLink to="/vault" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Vault
          </NavLink>
          <NavLink to="/legacy" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Legacy Contact
          </NavLink>

          <div className="nav-divider" />

          <NavLink to="/profile" className="nav-user">
            <div className="nav-avatar">{user.name?.[0]?.toUpperCase()}</div>
            <span className="nav-user-name">{user.name.split(' ')[0]}</span>
          </NavLink>
        </div>
      )}
    </nav>
  );
}
