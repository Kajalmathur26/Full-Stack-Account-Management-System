const supabase = require('../config/supabaseClient');

//  Get user balance
const getBalance = async (req, res) => {
    const { data: user, error } = await supabase
        .from('users')
        .select('balance')
        .eq('id', req.user.id)
        .single();

    if (error) {
        return res.status(400).json({ message: error.message });
    }

    res.json({ balance: user.balance });
};

// Transfer money
const transferMoney = async (req, res) => {
    const { receiverEmail, amount } = req.body;
    const senderId = req.user.id;

    if (!receiverEmail || !amount || amount <= 0) {
        return res.status(400).json({ message: 'Invalid transfer details' });
    }

    // here we Verify sender and balance
    const { data: sender, error: senderError } = await supabase
        .from('users')
        .select('balance, name')
        .eq('id', senderId)
        .single();

    if (senderError || !sender) {
        return res.status(404).json({ message: 'Sender not found' });
    }

    if (sender.balance < amount) {
        return res.status(400).json({ message: 'Insufficient balance' });
    }

    // here we verify receiver exists
    const { data: receiver, error: receiverError } = await supabase
        .from('users')
        .select('id, name, balance')
        .eq('email', receiverEmail)
        .single();

    if (receiverError || !receiver) {
        return res.status(404).json({ message: 'Receiver not found' });
    }

    if (receiver.id === senderId) {
        return res.status(400).json({ message: 'Cannot transfer to yourself' });
    }

    // Deduct from sender
    const { error: deductError } = await supabase
        .from('users')
        .update({ balance: Number(sender.balance) - Number(amount) })
        .eq('id', senderId);

    if (deductError) return res.status(500).json({ message: 'Transfer failed at deduction' });

    // Add to receiver
    const { error: addError } = await supabase
        .from('users')
        .update({ balance: Number(receiver.balance) + Number(amount) })
        .eq('id', receiver.id);

    if (addError) {
        // Rollback sender balance (basic)
        await supabase.from('users').update({ balance: sender.balance }).eq('id', senderId);
        return res.status(500).json({ message: 'Transfer failed at addition' });
    }

    // Record the transactions
    const { error: transError } = await supabase.from('transactions').insert([
        {
            user_id: senderId,
            sender_id: senderId,
            receiver_id: receiver.id,
            amount: amount,
            transaction_type: 'debit',
            balance_after: Number(sender.balance) - Number(amount)
        },
        {
            user_id: receiver.id,
            sender_id: senderId,
            receiver_id: receiver.id,
            amount: amount,
            transaction_type: 'credit',
            balance_after: Number(receiver.balance) + Number(amount)
        },
    ]);

    if (transError) {
        console.error('Transaction Recording Error:', transError);
        return res.status(500).json({ message: 'Balance updated but transaction log failed: ' + transError.message });
    }

    res.json({ message: 'Transfer successful', newBalance: Number(sender.balance) - Number(amount) });
};

// Get transaction history

const getStatement = async (req, res) => {
    const userId = req.user.id;

    const { data: transactions, error } = await supabase
        .from('transactions')
        .select(`
            id,
            amount,
            transaction_type,
            balance_after,
            created_at,
            sender:sender_id (name, email),
            receiver:receiver_id (name, email)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        return res.status(400).json({ message: error.message });
    }

    //  For mapping the transactions  
    const formattedTransactions = transactions.map(t => {
        const isSender = t.sender_id === userId;
        return t;
    });

    res.json(transactions);
};

//  Get all users 
const getUsers = async (req, res) => {
    const { data: users, error } = await supabase
        .from('users')
        .select('id, name, email')
        .neq('id', req.user.id);

    if (error) {
        return res.status(400).json({ message: error.message });
    }

    res.json(users);
};

module.exports = { getBalance, transferMoney, getStatement, getUsers };