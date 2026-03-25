import { useState } from 'react';
import '../css/vault.css';

const CATEGORIES = ['subscription', 'social', 'banking', 'photos', 'other'];
const empty = { label: '', platform: '', accountEmail: '', instructions: '', category: 'other' };

export default function VaultItemForm({ initial = empty, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(form);
    setLoading(false);
  };

  return (
    <form className="vault-form" onSubmit={submit}>
      <div className="vault-form-row">
        <input name="label" placeholder="Label (e.g. Netflix)" value={form.label} onChange={handle} required />
        <input name="platform" placeholder="Platform (e.g. netflix.com)" value={form.platform} onChange={handle} />
      </div>
      <div className="vault-form-row">
        <input name="accountEmail" placeholder="Account Email" value={form.accountEmail} onChange={handle} />
        <select name="category" value={form.category} onChange={handle}>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
        </select>
      </div>
      <textarea name="instructions" placeholder="Instructions / Notes (e.g. cancel before renewal, shared with family...)" value={form.instructions} onChange={handle} rows={3} />
      <div className="form-actions">
        <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save Item'}</button>
        {onCancel && <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
