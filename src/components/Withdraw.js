// import React, { useState } from 'react';
// import { Button, TextField, Typography } from '@mui/material';

// function Withdraw({ onTransaction }) {
//     const [amount, setAmount] = useState('');
//     const [error, setError] = useState('');

//     const handleWithdraw = () => {
//         const parsedAmount = parseFloat(amount);
//         if (isNaN(parsedAmount) || parsedAmount <= 0) {
//             setError("Please enter a positive amount.");
//             return;
//         }

//         //Newly Added Session
//         const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
//         if (!loggedInUser) {
//             setError("User not found. Please log in again. ");
//             return;
//         }

//         const updatedUser = {
//             ...loggedInUser,
//             balance: loggedInUser.balance - parsedAmount,
//         };
//         localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));

//         const transactionHistory = JSON.parse(localStorage.getItem('transactionHistory')) || [];
//         const newTransaction = {
//             type: 'Withdraw',
//             amount: parsedAmount,
//             date: new Date().toLocaleString(),
//         };
//         transactionHistory.push(newTransaction);
//         localStorage.setItem('transactionHistory', JSON.stringify(transactionHistory));

//         //End of the session

//         onTransaction(parsedAmount);
//         setAmount('');
//         setError('');
//     };

// return (
//     <div>
//         <Typography variant="h6">Withdraw</Typography>
//         <TextField
//             label="Amount (USD)"
//             value={amount}
//             onChange={(e) => setAmount(e.target.value)}
//             type="number"
//             error={!!error}
//             helperText={error}
//             fullWidth
//             margin="normal"
//         />
//         <Button variant="contained" color="primary" onClick={handleWithdraw}>
//             Withdraw
//         </Button>
//     </div>
// );
// }
// export default Withdraw;

import React, { useState } from 'react';
import { Button, TextField, Typography } from '@mui/material';

function Withdraw({ onTransaction }) {
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');

    const handleWithdraw = () => {
        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            setError("Please enter a positive amount.");
            return;
        }

        // Retrieve the logged-in user
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (!loggedInUser) {
            setError("User not found. Please log in again.");
            return;
        }

        if (loggedInUser.balance < parsedAmount) {
            setError("Insufficient balance for this withdrawal.");
            return;
        }

        // Update user balance
        const updatedUser = {
            ...loggedInUser,
            balance: loggedInUser.balance - parsedAmount,
        };
        localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));

        // Update all users in localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const updatedUsers = users.map(user =>
            user.username.toLowerCase() === loggedInUser.username.toLowerCase()
                ? { ...user, balance: updatedUser.balance }
                : user
        );
        localStorage.setItem('users', JSON.stringify(updatedUsers));

        // Save transaction to transaction history
        const transactionHistory = JSON.parse(localStorage.getItem('transactionHistory')) || [];
        const newTransaction = {
            type: 'Withdraw',
            amount: parsedAmount,
            date: new Date().toLocaleString(),
        };
        transactionHistory.push(newTransaction);
        localStorage.setItem('transactionHistory', JSON.stringify(transactionHistory));

        // Trigger onTransaction callback
        onTransaction(parsedAmount);

        // Reset form state
        setAmount('');
        setError('');
    };

    return (
        <div>
            <Typography variant="h6">Withdraw</Typography>
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
            <Button variant="contained" color="primary" onClick={handleWithdraw}>
                Withdraw
            </Button>
        </div>
    );
}

export default Withdraw;
