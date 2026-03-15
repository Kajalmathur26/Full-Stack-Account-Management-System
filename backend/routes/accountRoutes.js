const express = require('express');
const router = express.Router();
const { getBalance, transferMoney, getStatement, getUsers } = require('../controllers/accountController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/balance', protect, getBalance);
router.post('/transfer', protect, transferMoney);
router.get('/statement', protect, getStatement);
router.get('/', protect, getUsers); // GET /api/users


module.exports = router;