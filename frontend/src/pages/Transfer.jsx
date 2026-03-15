import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Transfer = () => {
    const [receiverEmail, setReceiverEmail] = useState('');
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleTransfer = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            await axios.post('/api/account/transfer', 
                { receiverEmail, amount: Number(amount) },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            setSuccess('Payment sent successfully! Redirecting...');
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Transfer failed. Check details and balance.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="glass-card">
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'rgba(99, 102, 241, 0.1)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: '16px' }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                    </div>
                    <h1 style={{ fontSize: '1.75rem' }}>Send Money</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Transfer funds instantly to any user</p>
                </div>

                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>{success}</div>}

                <form onSubmit={handleTransfer}>
                    <div className="input-group">
                        <label>Receiver's Email</label>
                        <input type="email" placeholder="friend@example.com" value={receiverEmail} onChange={(e) => setReceiverEmail(e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <label>Amount (₹)</label>
                        <input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} required min="1" />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Processing Transfer...' : 'Send Now'}
                    </button>
                </form>

                <button onClick={() => navigate('/dashboard')} className="btn btn-secondary" style={{ marginTop: '12px' }}>
                    Cancel & Return
                </button>
            </div>
        </div>
    );
};

export default Transfer;