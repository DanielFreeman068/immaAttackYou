const express = require('express');
const Transaction = require('../models/transaction');
const router = express.Router();

router.post('/api/transactions', async (req, res) => {
    const { type, amount, date, category } = req.body;

    try {
        const transaction = new Transaction({ type, amount, date, category });
        console.log(transaction)
        await transaction.save();
        res.status(201).json(transaction);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;

