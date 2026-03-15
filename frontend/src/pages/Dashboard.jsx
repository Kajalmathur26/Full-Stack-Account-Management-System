import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [balance, setBalance] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user, logout } = useAuth();

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const { data } = await axios.get('/api/account/balance', {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setBalance(data.balance);
            } catch (err) {
                console.error('Error fetching balance:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchBalance();
    }, [user.token]);

    return (
        <div className="dashboard-layout">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>Hello, {user.name} 👋</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Welcome back to your wallet</p>
                </div>
                <button onClick={logout} className="btn" style={{ width: 'auto', padding: '10px 20px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)' }}>Logout</button>
            </header>

            <div className="balance-card">
                <p className="balance-label">Available Balance</p>
                <h1 className="balance-amount">₹{loading ? '...' : Number(balance).toLocaleString()}</h1>
                <div style={{ marginTop: '20px', display: 'flex', gap: '8px', alignItems: 'center', color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>
                    <span style={{ padding: '4px 8px', background: 'rgba(255,255,255,0.2)', borderRadius: '6px' }}>SAVINGS ACCOUNT</span>
                    <span>•••• 4242</span>
                </div>
            </div>

            <div className="actions-grid">
                <Link to="/transfer" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                    Send Money
                </Link>
                <Link to="/statement" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                    View Statement
                </Link>
            </div>

            <section>
                <h3 style={{ marginBottom: '20px' }}>Quick Insight</h3>
                <div className="glass-card" style={{ maxWidth: '100%', padding: '24px', display: 'flex', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="m17 5-5-3-5 3"/><path d="m17 19-5 3-5-3"/><rect width="18" height="8" x="3" y="8" rx="2"/></svg>
                    </div>
                    <div>
                        <h4 style={{ fontSize: '1rem', marginBottom: '4px' }}>Secure Transactions</h4>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Your transfers are protected with industry-standard encryption and real-time monitoring.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Dashboard;