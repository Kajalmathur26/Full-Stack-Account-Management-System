const bcrypt = require('bcryptjs');
const supabase = require('../config/supabaseClient');
const generateToken = require('../utils/generateToken');

//Registering a new user
const signup = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please add all fields' });
    }

    // Check if user exists
    const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const { data: newUser, error } = await supabase
        .from('users')
        .insert([{ name, email, password: hashedPassword, balance: 10000 }])
        .select()
        .single();

    if (error) {
        return res.status(400).json({ message: error.message });
    }

    if (newUser) {

        // Record initial deposit transaction
        const { error: transError } = await supabase.from('transactions').insert([{
            user_id: newUser.id,
            amount: 10000,
            transaction_type: 'credit',
            balance_after: 10000,
            sender_id: newUser.id,
            receiver_id: newUser.id
        }]);

        if (transError) console.error('Initial Transaction Error:', transError);

        res.status(201).json({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            balance: newUser.balance,
            token: generateToken(newUser.id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// Authenticating a user
const login = async (req, res) => {
    const { email, password } = req.body;

    const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            balance: user.balance,
            token: generateToken(user.id),
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

module.exports = { signup, login };