const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Expense', 'Income'],
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: [
            'Home & Utilities', 'Transportation', 'Groceries', 
            'Health', 'Restaurants & Dining', 'Shopping & Entertainment',
            'Cash, Checks & Misc', 'Payroll', 'Checks/Misc', 'Other',
        ],
    },
});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;