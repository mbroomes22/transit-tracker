import React from 'react';
import Header from './Header.js';

function Login() {
 return(
    <div>
        <Header />
        <div className='login-container'>
            <h1>Login</h1>
            <form>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" name="username" required />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" required />
                </div>
                <button type="submit">Login</button>
            </form>
            <p>Don't have an account? <a href="/register">Register here</a></p>
            <p>Forgot your password? <a href="/reset-password">Reset it here</a></p>
        </div>
    </div>
 )   
}

export default Login;