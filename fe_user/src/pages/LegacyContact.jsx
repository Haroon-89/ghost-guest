import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Header from '../components/Header';
import '../css/pages.css';

export default function LegacyContact() {
  const [form, setForm] = useState({ name: '', email: '' });
  const [current, setCurrent] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/auth/me').then(({ data }) => {
      const lc = data.legacyContact;
      if (lc && lc.name && lc.email) {
        setCurrent(lc);
        setForm({ name: lc.name, email: lc.email });
      }
    }).catch(() => {});
  }, []);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/legacy', form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save');
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <Header
        icon="👤"
        title="Legacy Contact"
        subtitle="This person will receive your encrypted vault if you go inactive"
      />

      <div className="legacy-container">
        {current && (
          <div className="legacy-current">
            <div className="legacy-current-icon">👤</div>
            <div className="legacy-current-info">
              <h4>Current Contact: {current.name}</h4>
              <p>{current.email}</p>
            </div>
          </div>
        )}

        <div className="legacy-card">
          <p className="legacy-form-title">{current ? 'Update legacy contact' : 'Set a legacy contact'}</p>

          {error && <div className="error-msg" style={{ marginTop: '0.75rem' }}>{error}</div>}

          <form className="legacy-form" onSubmit={submit}>
            <div className="input-group">
              <label className="input-label">Full Name</label>
              <input name="name" placeholder="e.g. Jane Doe" value={form.name} onChange={handle} required />
            </div>
            <div className="input-group">
              <label className="input-label">Email Address</label>
              <input name="email" type="email" placeholder="jane@example.com" value={form.email} onChange={handle} required />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save & Go to Dashboard'}
            </button>
          </form>
        </div>

        <div className="info-banner">
          <span className="info-icon"></span>
          <span>If you don't log in for <strong>{3} months</strong>, Ghost-Guest will send you up to 3 verification emails. If there's no response, your vault will be securely sent to this contact.</span>
        </div>
      </div>
    </div>
  );
}
