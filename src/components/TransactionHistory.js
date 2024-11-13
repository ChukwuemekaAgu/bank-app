import React, { useEffect, useState } from 'react';
import './Styles.css';

function TransactionHistory() {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchTransactions = () => {
            const storedTransactions = JSON.parse(localStorage.getItem('transactionHistory')) || [];
            setTransactions(storedTransactions);
        };

        fetchTransactions();

        window.addEventListener('storage', fetchTransactions);

        return () => window.removeEventListener('storage', fetchTransactions);
    }, []);

    return (
        <div className="transaction-history">
            <h2>Transaction History</h2>
            <ul>
                {transactions.map((transaction, index) => (
                    <li key={index}>
                        {transaction.date}: {transaction.type} - ${transaction.amount.toFixed(2)} 
                        {transaction.recipient && ` (Recipient: ${transaction.recipient})`}
                    </li>
                ))}
            </ul>
            {transactions.length === 0 && <p>No transactions recorded yet.</p>}
        </div>
    );
}

export default TransactionHistory;
