import React, {useState} from 'react';
// import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import axios from 'axios';
import Header from './Header.js';

// sent get request to server to login a user
// send message to the user if the login was successful
// send message to the user if the login was unsuccessful
// send message to the user if the user is not registered
// user should not be able to access this page if they're already logged in
function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');


    const handleSubmit = async (event) => {
        event.preventDefault();
        // Fetch data from the backend route
       
            try {
            const response = await axios.get('/api/users/', {
               username: username,
               password: password
            });

            if (response.status === 200) {
                setMessage('Login successful!');
            } else if (response.status === 401) {
                setMessage('Invalid credentials. Please try again.');
            } else {
                setMessage('No user found with that username/email. Please register.');
            }
         } catch (error) {
            console.error('Error during login:', error);
            setMessage('An error occurred during login. Please try again.');
            }
        };

    return(
        <div>
            <Header />
            <div className='login-container'>
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="username">Username:</label>
                        <input 
                        type="text" 
                        id="username" 
                        name="username" 
                        placeholder='username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required />
                    </div>
                    <div>
                        <label htmlFor="password">Password:</label>
                        <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        placeholder='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required />
                    </div>
                    <button type="submit">Login</button>
                </form>
                {message && <p>{message}</p>}
                <p>Don't have an account? <a href="/register">Register here</a></p>
                <p>Forgot your password? <a href="/reset-password">Reset it here</a></p>
            </div>
        </div>
    )   
}

export default Login;