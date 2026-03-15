import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    if (!user) return null;

    return (
        <nav style={{
            background: 'var(--glass-bg)',
            backdropFilter: 'var(--glass-blur)',
            borderBottom: '1px solid var(--surface-border)',
            padding: '16px 40px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            <Link to="/dashboard" style={{
                fontSize: '1.25rem',
                fontWeight: '800',
                textDecoration: 'none',
                background: 'linear-gradient(to right, #6366f1, #a855f7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
            }}>
                WalletSystem
            </Link>
            <div className="nav-links" style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                <Link to="/dashboard" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>Dashboard</Link>
                <Link to="/transfer" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>Send Money</Link>
                <Link to="/statement" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>Statements</Link>
                <button onClick={logout} style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--error)',
                    background: 'transparent',
                    color: 'var(--error)',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: '600'
                }}>
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
