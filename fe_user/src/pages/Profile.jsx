import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import '../css/pages.css';

export default function Profile() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/auth/me').then(({ data }) => setProfile(data)).catch(() => {});
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  const data = profile || user;
  const legacy = profile?.legacyContact?.name && profile?.legacyContact?.email
    ? profile.legacyContact
    : null;

  return (
    <div className="page">
      <Header title="Profile" subtitle="Your account details and security info" />

      <div className="profile-header">
        <div className="profile-avatar-lg">{data?.name?.[0]?.toUpperCase()}</div>
        <div className="profile-header-info">
          <h2>{data?.name}</h2>
          <p>{data?.email}</p>
        </div>
        <button className="btn-logout" onClick={handleLogout}>
          Sign Out
        </button>
      </div>

      <div className="profile-grid">
        <div className="profile-section">
          <div className="profile-section-title">Account Info</div>
          <div className="profile-row">
            <span className="key">Name</span>
            <span className="val">{data?.name}</span>
          </div>
          <div className="profile-row">
            <span className="key">Email</span>
            <span className="val">{data?.email}</span>
          </div>
          <div className="profile-row">
            <span className="key">Role</span>
            <span className="val" style={{ textTransform: 'capitalize' }}>{data?.role}</span>
          </div>
          <div className="profile-row">
            <span className="key">Status</span>
            <span className="val"><span className="status-dot">Active</span></span>
          </div>
        </div>

        <div className="profile-section">
          <div className="profile-section-title">Legacy Contact</div>
          {legacy?.name ? (
            <>
              <div className="profile-row">
                <span className="key">Name</span>
                <span className="val">{legacy.name}</span>
              </div>
              <div className="profile-row">
                <span className="key">Email</span>
                <span className="val">{legacy.email}</span>
              </div>
            </>
          ) : (
            <p style={{ color: 'var(--text3)', fontSize: '0.875rem', padding: '0.5rem 0' }}>
              No legacy contact set yet.
            </p>
          )}
        </div>

        <div className="profile-section">
          <div className="profile-section-title">Dead Man's Switch</div>
          <div className="profile-row">
            <span className="key">Threshold</span>
            <span className="val">{profile?.switchMonths ?? 3} months</span>
          </div>
          <div className="profile-row">
            <span className="key">Emails Sent</span>
            <span className="val">{profile?.verificationEmailsSent ?? 0} / 3</span>
          </div>
          <div className="profile-row">
            <span className="key">Vault Released</span>
            <span className="val" style={{ color: profile?.vaultReleased ? 'var(--danger)' : 'var(--success)' }}>
              {profile?.vaultReleased ? 'Yes' : 'No'}
            </span>
          </div>
        </div>

        <div className="profile-section">
          <div className="profile-section-title">Security</div>
          <div className="profile-row">
            <span className="key">Encryption</span>
            <span className="val">AES-256-CBC</span>
          </div>
          <div className="profile-row">
            <span className="key">Auth</span>
            <span className="val">JWT (7 days)</span>
          </div>
          <div className="profile-row">
            <span className="key">Passwords</span>
            <span className="val">bcrypt hashed</span>
          </div>
        </div>
      </div>
    </div>
  );
}
