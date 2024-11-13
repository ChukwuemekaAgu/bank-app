import React, { useState } from 'react';
import { Button, TextField, Typography } from '@mui/material';

function Deposit({ onTransaction }) {
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');

    const handleDeposit = () => {
        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            setError("Please enter a positive amount.");
            return;
        }

        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (!loggedInUser) {
            setError("User not found. Please log in again.");
            return;
        }

        const updatedUser = {
            ...loggedInUser,
            balance: loggedInUser.balance + parsedAmount,
        };
        localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));

        const transactionHistory = JSON.parse(localStorage.getItem('transactionHistory')) || [];
        const newTransaction = {
            type: 'Deposit',
            amount: parsedAmount,
            date: new Date().toLocaleString(),
        };
        transactionHistory.push(newTransaction);
        localStorage.setItem('transactionHistory', JSON.stringify(transactionHistory));

        onTransaction(parsedAmount);

        setAmount('');
        setError('');
    };

    return (
        <div>
            <Typography variant="h6">Deposit</Typography>
            <TextField
                label="Amount (USD)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
                error={!!error}
                helperText={error}
                fullWidth
                margin="normal"
            />
            <Button variant="contained" color="primary" onClick={handleDeposit}>
                Deposit
            </Button>
        </div>
    );
}

export default Deposit;
