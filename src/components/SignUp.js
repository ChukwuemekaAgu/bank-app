import React, { useState } from 'react';
import bailey from './bailey.png';
import { Link, useNavigate } from 'react-router-dom';
import './Styles.css';

const SignUp = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        initialDeposit: ''
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { username, password, initialDeposit } = formData;

        const validationErrors = {};
        if (!validateUsername(username)) {
            validationErrors.username = 'The username is invalid or username already exists.';
        }
        if (!validatePassword(password)) {
            validationErrors.password = 'Password must contain at least 8 characters, including an uppercase letter, a lowercase letter, a number, and a special character.';
        }
        if (!validateDeposit(initialDeposit)) {
            validationErrors.initialDeposit = 'The initial deposit must be a positive number.';
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const newUser = {
            username: capitalize(username),
            password,
            balance: parseFloat(initialDeposit) || 0,
        };

        const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
        existingUsers.push(newUser);
        localStorage.setItem('users', JSON.stringify(existingUsers));

        const transactionHistory = JSON.parse(localStorage.getItem('transactionHistory')) || [];
        const initialTransaction = {
            type: 'Initial Deposit',
            amount: parseFloat(initialDeposit),
            inflow: true,
            outflow: false,
            recipient: 'N/A',
            date: new Date().toLocaleString(),
        };
        transactionHistory.push(initialTransaction);
        localStorage.setItem('transactionHistory', JSON.stringify(transactionHistory));

        alert('Account created successfully!');
        navigate('/signin');
    };

    const validateUsername = (username) => {
        if (username.trim() === '') return false;

        const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
        return !existingUsers.some(user => user.username.toLowerCase() === username.toLowerCase());
    };

    const validatePassword = (password) =>
        password.length >= 8 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[@$!%*?&]/.test(password);

    const validateDeposit = (deposit) => /^\d+(\.\d{1,2})?$/.test(deposit) && Number(deposit) > 0;

    const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

    return (
        <div className="container">
            <div className="left-section">
                <div className="overlay">
                    <img src={bailey} alt="Logo" className="logo" />
                    <h2 className="welcome-text">Welcome!</h2>
                    <p className="description-text">Create an account to start managing your finances with ease.</p>
                </div>
            </div>
            <div className="right-section">
                <h1>Sign Up</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        className={errors.username ? 'error-field' : ''}
                    />
                    {errors.username && <p className="field-error">{errors.username}</p>}

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className={errors.password ? 'error-field' : ''}
                    />
                    {errors.password && <p className="field-error">{errors.password}</p>}

                    <input
                        type="text"
                        name="initialDeposit"
                        placeholder="Initial Deposit (USD)"
                        value={formData.initialDeposit}
                        onChange={handleChange}
                        className={errors.initialDeposit ? 'error-field' : ''}
                    />
                    {errors.initialDeposit && <p className="field-error">{errors.initialDeposit}</p>}

                    <button type="submit">Proceed</button>
                    <p className="signin-link">
                        Already have an account? <Link to="/signin">Log in</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default SignUp;

