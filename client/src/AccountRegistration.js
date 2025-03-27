import React from 'react';
import Header from './Header';

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