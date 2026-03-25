import { useEffect, useState } from 'react';
import api from '../api/axios';
import Header from '../components/Header';
import VaultItemCard from '../components/VaultItemCard';
import VaultItemForm from '../components/VaultItemForm';
import '../css/vault.css';

export default function Vault() {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');

  const fetchItems = () => api.get('/vault').then(({ data }) => setItems(data)).catch(() => {});

  useEffect(() => { fetchItems(); }, []);

  const handleAdd = async (form) => {
    try {
      await api.post('/vault', form);
      setShowForm(false);
      fetchItems();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add item');
    }
  };

  const handleUpdate = async (form) => {
    try {
      await api.put(`/vault/${editing._id}`, form);
      setEditing(null);
      fetchItems();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update item');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this vault item?')) return;
    try {
      await api.delete(`/vault/${id}`);
      fetchItems();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete item');
    }
  };

  return (
    <div className="page">
      <Header
        icon=""
        title="My Vault"
        subtitle={`${items.length} encrypted item${items.length !== 1 ? 's' : ''} stored securely`}
        action={!showForm && !editing && (
          <button className="btn-primary" onClick={() => setShowForm(true)}>+ Add Item</button>
        )}
      />

      {error && <div className="error-msg">{error}</div>}

      {showForm && (
        <div className="form-section">
          <div className="form-section-title">New Vault Item</div>
          <VaultItemForm onSubmit={handleAdd} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {editing && (
        <div className="form-section">
          <div className="form-section-title">Edit — {editing.label}</div>
          <VaultItemForm initial={editing} onSubmit={handleUpdate} onCancel={() => setEditing(null)} />
        </div>
      )}

      {items.length === 0 && !showForm ? (
        <div className="empty-state">
          <div className="empty-icon"></div>
          <p>No vault items yet.</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
            <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={() => setShowForm(true)}>Add your first item</button>
          </p>
        </div>
      ) : (
        <div className="vault-grid">
          {items.map((item) => (
            <VaultItemCard key={item._id} item={item} onEdit={setEditing} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
