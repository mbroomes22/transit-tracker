import React from 'react';
import Header from './Header';

function MyAccount() {
    return(
        <div>
            <Header />
            <div className='account-container'>
                <h1>My Account</h1>
                <div>
                    <p>Welcome to your account page! Here you can manage your account settings, view your saved trips, and access other features.</p>
                </div>
                <div>
                    <h2>Account Settings</h2>
                    <p>Update your account information here.</p>
                </div>
                <div>
                    <h2>Saved Trips</h2>
                    <p>View and manage your saved trips.</p>
                </div>
            </div>
        </div>
    )
}

export default MyAccount;