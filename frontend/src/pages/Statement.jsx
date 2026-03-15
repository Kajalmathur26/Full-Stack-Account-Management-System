import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Statement = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStatement = async () => {
            try {
                const { data } = await axios.get('/api/account/statement', {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setTransactions(data);
            } catch (err) {
                console.error('Error fetching statement:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStatement();
    }, [user.token]);

    return (
        <div className="dashboard-layout">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>Transaction History</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Track your spending and earnings</p>
                </div>
                <button onClick={() => navigate('/dashboard')} className="btn btn-secondary" style={{ width: 'auto', padding: '10px 20px' }}>
                    Dashboard
                </button>
            </header>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '100px', color: 'var(--text-secondary)' }}>Loading transactions...</div>
            ) : transactions.length === 0 ? (
                <div className="glass-card" style={{ maxWidth: '100%', textAlign: 'center', padding: '60px' }}>
                    <p style={{ color: 'var(--text-secondary)' }}>No transactions found yet.</p>
                </div>
            ) : (
                <div className="table-container shadow-2xl">
                    <table>
                        <thead>
                            <tr>
                                <th style={{ padding: '16px 24px' }}>Date</th>
                                <th style={{ padding: '16px 24px' }}>Type</th>
                                <th style={{ padding: '16px 24px', textAlign: 'right' }}>Amount</th>
                                <th style={{ padding: '16px 24px' }}>From</th>
                                <th style={{ padding: '16px 24px' }}>To</th>
                                <th style={{ padding: '16px 24px', textAlign: 'right' }}>Balance After</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((t) => {
                                const isDebit = t.transaction_type === 'debit';
                                return (
                                    <tr key={t.id} style={{ background: 'rgba(255,255,255,0.01)' }}>
                                        <td style={{ padding: '16px 24px', color: 'var(--text-secondary)' }}>
                                            {new Date(t.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <span style={{ 
                                                color: isDebit ? 'var(--error)' : 'var(--success)', 
                                                fontWeight: 'bold',
                                                textTransform: 'uppercase',
                                                fontSize: '0.8rem',
                                                letterSpacing: '0.05em'
                                            }}>
                                                {t.transaction_type}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px 24px', textAlign: 'right', fontWeight: '700', color: isDebit ? 'var(--error)' : 'var(--success)' }}>
                                            {isDebit ? '-' : '+'} ₹{Number(t.amount).toLocaleString()}
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            {isDebit ? 'You' : (t.sender?.name || 'External')}
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            {isDebit ? (t.receiver?.name || 'External') : 'You'}
                                        </td>
                                        <td style={{ padding: '16px 24px', textAlign: 'right', color: 'var(--text-primary)', fontWeight: '500' }}>
                                            ₹{Number(t.balance_after).toLocaleString()}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Statement;