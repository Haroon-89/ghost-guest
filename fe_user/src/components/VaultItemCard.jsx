import '../css/vault.css';

export default function VaultItemCard({ item, onEdit, onDelete }) {
  return (
    <div className="vault-card">
      <div className="vault-card-body">
        <div className="vault-card-header">
          <span className="vault-card-title">{item.label}</span>
          <span className={`badge badge-${item.category}`}>{item.category}</span>
        </div>

        {item.platform && (
          <div className="vault-card-row">
            <span className="label">Platform</span>
            <span>{item.platform}</span>
          </div>
        )}
        {item.accountEmail && (
          <div className="vault-card-row">
            <span className="label">Account</span>
            <span>{item.accountEmail}</span>
          </div>
        )}
        {item.instructions && (
          <div className="vault-card-instructions">{item.instructions}</div>
        )}
      </div>

      <div className="card-actions">
        <button className="btn-edit" onClick={() => onEdit(item)}>✏️ Edit</button>
        <button className="btn-del" onClick={() => onDelete(item._id)}>🗑 Delete</button>
      </div>
    </div>
  );
}
