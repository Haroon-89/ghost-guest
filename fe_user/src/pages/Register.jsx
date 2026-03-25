import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import '../css/auth.css';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', form);
      const payload = JSON.parse(atob(data.token.split('.')[1]));
      login(data.token, { id: payload.id, name: payload.name, email: payload.email, role: payload.role });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="logo-icon"></span>
          <span className="logo-text">Ghost-Guest</span>
        </div>

        <h1 className="auth-title">Create your account</h1>
        <p className="auth-subtitle">Secure your digital life for the people you love</p>

        {error && <div className="error-msg">{error}</div>}

        <form className="auth-form" onSubmit={submit}>
          <div className="input-group">
            <label className="input-label">Full Name</label>
            <input name="name" placeholder="John Doe" value={form.name} onChange={handle} required />
          </div>
          <div className="input-group">
            <label className="input-label">Email address</label>
            <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handle} required />
          </div>
          <div className="input-group">
            <label className="input-label">Password</label>
            <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={handle} required />
          </div>
          <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
