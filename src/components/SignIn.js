import React, { useState } from 'react';
import bailey from './bailey.png';
import { Link, useNavigate } from 'react-router-dom';
import './Styles.css';

const SignIn = () => {
    const navigate = useNavigate();

    const [loginData, setLoginData] = useState({
        username: '',
        password: ''
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
        const foundUser = storedUsers.find(
            user => user.username.toLowerCase() === loginData.username.toLowerCase());
            if (foundUser) {
                foundUser.balance = Number(foundUser.balance) || 0;
    }

        const validationErrors = {};

        if (!foundUser) {
            validationErrors.username = 'Username does not exist.';
        } else if (foundUser.password !== loginData.password) {
            validationErrors.password = 'Incorrect password.';
        }
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        localStorage.setItem('loggedInUser', JSON.stringify(foundUser));

        alert('Login successful!');
        navigate('/dashboard');
    };

    return (
        <div className="container">
            <div className="left-section-signin">
                <div className="overlay">
                    <img src={bailey} alt="Logo" className="logo" />
                    <h2 className="welcome-text">Welcome Back!</h2>
                    <p className="description-text">Sign in to continue managing your finances seamlessly.</p>
                </div>
            </div>
            <div className="right-section">
                <h1>Log In</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={loginData.username}
                        onChange={handleChange}
                        className={errors.username ? 'error-field' : ''}
                    />
                    {errors.username && <p className="field-error">{errors.username}</p>}

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={loginData.password}
                        onChange={handleChange}
                        className={errors.password ? 'error-field' : ''}
                    />
                    {errors.password && <p className="field-error">{errors.password}</p>}

                    <button type="submit">Log in</button>

                    <p className="signin-link">
                        Don’t have an account? <Link to="/signup">Sign Up</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default SignIn;
