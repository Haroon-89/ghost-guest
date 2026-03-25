export default function Header({ icon, title, subtitle, action }) {
  return (
    <div className="page-header">
      <div>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.6rem',
          background: 'linear-gradient(135deg, var(--text) 0%, var(--accent) 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          {icon && <span style={{ WebkitTextFillColor: 'initial' }}>{icon}</span>}
          {title}
        </h2>
        {subtitle && <p style={{ color: 'var(--text2)', fontSize: '0.875rem', marginTop: '0.25rem' }}>{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
