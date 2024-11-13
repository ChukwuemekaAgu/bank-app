import React, { useState } from 'react';
import { Button, TextField, Typography } from '@mui/material';

function Transfer({ onTransaction }) {
    const [amount, setAmount] = useState('');
    const [recipient, setRecipient] = useState('');
    const [error, setError] = useState('');

    const handleTransfer = () => {
        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            setError("Please enter a positive amount.");
            return;
        }

        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (!loggedInUser) {
            setError("User not logged in. Please log in again.");
            return;
        }

        if (loggedInUser.balance < parsedAmount) {
            setError("Insufficient balance for this transfer.");
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const recipientUser = users.find(user => user.username.toLowerCase() === recipient.toLowerCase());

        if (!recipientUser) {
            setError("Recipient does not exist. Please enter a valid username.");
            return;
        }

        const updatedUsers = users.map(user => {
            if (user.username.toLowerCase() === loggedInUser.username.toLowerCase()) {
                return { ...user, balance: user.balance - parsedAmount };
            } else if (user.username.toLowerCase() === recipient.toLowerCase()) {
                return { ...user, balance: user.balance + parsedAmount };
            }
            return user;
        });

        localStorage.setItem('users', JSON.stringify(updatedUsers));

        const updatedLoggedInUser = { ...loggedInUser, balance: loggedInUser.balance - parsedAmount };
        localStorage.setItem('loggedInUser', JSON.stringify(updatedLoggedInUser));

        const transactionHistory = JSON.parse(localStorage.getItem('transactionHistory')) || [];
        const newTransaction = {
            type: 'Transfer',
            amount: parsedAmount,
            recipient,
            date: new Date().toLocaleString(),
        };
        transactionHistory.push(newTransaction);
        localStorage.setItem('transactionHistory', JSON.stringify(transactionHistory));

        onTransaction(parsedAmount, recipient);

        setAmount('');
        setRecipient('');
        setError('');
    };

    return (
        <div>
            <Typography variant="h6">Transfer</Typography>
            <TextField
                label="Recipient"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                fullWidth
                margin="normal"
            />
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
            <Button variant="contained" color="primary" onClick={handleTransfer}>
                Transfer
            </Button>
        </div>
    );
}

export default Transfer;
