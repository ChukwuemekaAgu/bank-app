import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, CssBaseline, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, Paper, Divider,
} from '@mui/material';
import { AccountBalance, Payment, Send, History, Help, Person, ExitToApp } from '@mui/icons-material';
import Deposit from './Deposit';
import Withdraw from './Withdraw';
import Transfer from './Transfer';
import TransactionHistory from './TransactionHistory';

const drawerWidth = 240;

const Dashboard = () => {
    const [user, setUser] = useState({ username: 'User', balance: 0 });
    const [transactions, setTransactions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        console.log("LoggedInUser Data: ", loggedInUser);
            if (!loggedInUser || typeof loggedInUser.balance !== 'number') {
                alert("Invalid session or user data. Redirecting to Sign In.");
                navigate('/signin');
            } else {

            setUser({
                username: loggedInUser.username || 'User',
                balance: Number(loggedInUser.balance) || 0,
            });
        }

        const storedTransactions = JSON.parse(localStorage.getItem('transactionHistory')) || [];
        setTransactions(storedTransactions);
        
    }, [navigate]);

    const handleTransaction = (type, amount, recipient = null) => {
        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            alert("Amount must be a positive number!");
            return;
        }

        const newTransaction = {
            type,
            amount: parsedAmount,
            inflow: type === 'Deposit',
            outflow: type !== 'Deposit',
            recipient: recipient || 'N/A',
            date: new Date().toLocaleString(),
        };

        const updatedTransactions = [...transactions, newTransaction];
        setTransactions(updatedTransactions);
        localStorage.setItem('transactionHistory', JSON.stringify(updatedTransactions));

        const updatedUser = {
            ...user,
            balance: type === 'Deposit'
                ? user.balance + parsedAmount
                : user.balance - parsedAmount,
        };
        setUser(updatedUser);
        localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
    };
    
    const handleLogout = () => {
        localStorage.removeItem('loggedInUser');
        navigate('/signin');
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
                }}
                variant="permanent"
                anchor="left"
            >
                <List>
                    <ListItem>
                        <Typography variant="h5" align="center">
                            Welcome, {user.username} <br />
                            Balance: ${user.balance ? user.balance.toFixed(2) : '0.00'}
                        </Typography>
                    </ListItem>
                    <Divider />
                    <ListItem button><ListItemIcon><AccountBalance /></ListItemIcon><ListItemText primary="Dashboard" /></ListItem>
                    <ListItem button><ListItemIcon><Payment /></ListItemIcon><ListItemText primary="Transfer" /></ListItem>
                    <ListItem button><ListItemIcon><Send /></ListItemIcon><ListItemText primary="Deposit" /></ListItem>
                    <ListItem button><ListItemIcon><Send /></ListItemIcon><ListItemText primary="Withdraw" /></ListItem>
                    <ListItem button><ListItemIcon><History /></ListItemIcon><ListItemText primary="Activity" /></ListItem>
                    <ListItem button><ListItemIcon><Help /></ListItemIcon><ListItemText primary="Help Support" /></ListItem>
                    <ListItem button><ListItemIcon><Person /></ListItemIcon><ListItemText primary="Profile" /></ListItem>
                    <ListItem button onClick={handleLogout}>
                        <ListItemIcon><ExitToApp /></ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItem>
                </List>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, padding: 3 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Paper elevation={3} sx={{ padding: 2, flex: 1 }}>
                        <Deposit onTransaction={(amount) => handleTransaction('Deposit', amount)} />
                    </Paper>
                    <Paper elevation={3} sx={{ padding: 2, flex: 1 }}>
                        <Withdraw onTransaction={(amount) => handleTransaction('Withdraw', amount)} />
                    </Paper>
                    <Paper elevation={3} sx={{ padding: 2, flex: 1 }}>
                        <Transfer onTransaction={(amount, recipient) => handleTransaction('Transfer', amount, recipient)} />
                    </Paper>
                </Box>
                <Box sx={{ marginTop: 4 }}>
                    <TransactionHistory transactions={transactions} />
                </Box>
            </Box>
        </Box>
    );
};

export default Dashboard;
