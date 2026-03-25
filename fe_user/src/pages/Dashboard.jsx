import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import '../css/dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const [vaultCount, setVaultCount] = useState(0);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.get('/vault').then(({ data }) => setVaultCount(data.length)).catch(() => {});
    api.get('/auth/me').then(({ data }) => setProfile(data)).catch(() => {});
  }, []);

  const legacy = profile?.legacyContact?.name ? profile.legacyContact : null;

  return (
    <div className="page">
      <div className="dashboard-hero">
        <h2>Welcome back, <span>{user?.name?.split(' ')[0]}</span></h2>
        <p>Your digital estate is secure and ready. Here's your overview.</p>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon purple"></div>
          <div>
            <div className="stat-value">{vaultCount}</div>
            <div className="stat-label">Vault Items</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue"></div>
          <div>
            <div className="stat-value">{legacy ? '✓' : '—'}</div>
            <div className="stat-label">Legacy Contact</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"></div>
          <div>
            <div className="stat-value">Active</div>
            <div className="stat-label">Account Status</div>
          </div>
        </div>
      </div>

      {legacy && (
        <div className="legacy-info-box" style={{ marginBottom: '1.5rem' }}>
          <span></span>
          <span>Legacy contact: <strong>{legacy.name}</strong> ({legacy.email})</span>
          <Link to="/legacy" style={{ marginLeft: 'auto', fontSize: '0.8rem' }}>Change</Link>
        </div>
      )}

      <div className="dash-grid">
        <div className="dash-card">
          <div className="dash-card-icon"></div>
          <h3>Digital Vault</h3>
          <p>Store and encrypt your subscriptions, social accounts, banking info, and more.</p>
          <Link to="/vault" className="btn-primary">Manage Vault</Link>
        </div>
        <div className="dash-card">
          <div className="dash-card-icon"></div>
          <h3>Legacy Contact</h3>
          <p>{legacy ? `${legacy.name} will receive your vault if you go inactive.` : 'Set who receives your vault if you go inactive.'}</p>
          <Link to="/legacy" className="btn-primary">{legacy ? 'Update Contact' : 'Set Contact'}</Link>
        </div>
        <div className="dash-card">
          <div className="dash-card-icon"></div>
          <h3>Your Profile</h3>
          <p>View your account details and understand how the Dead Man's Switch works.</p>
          <Link to="/profile" className="btn-primary">View Profile</Link>
        </div>
      </div>
    </div>
  );
}
