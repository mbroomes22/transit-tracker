import React from 'react';
import Header from './Header';

// sent post request to server to register a new user
// verify that the user is not already registered
// if the user is already registered, send a message to the user
// send a message to the user if the registration was successful
function AccountRegistration() {
    return(
        <div>
            <Header />
            <div className='registration-container'>
                <h1>Account Registration</h1>
                <div>
                    <form>
                        <label htmlFor="username">Username:</label>
                        <input type="text" id="username" name="username" required />
                        <br />
                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" name="email" required />
                        <br />
                        <label htmlFor="password">Password:</label>
                        <input type="password" id="password" name="password" required />
                        <br />
                        <button type="submit">Register</button>
                    </form>
                </div>
                <div>
                    <p>Already have an account? <a href="/login">Login here</a></p>
                </div>
            </div>
        </div>
    )
}

export default AccountRegistration;