import React from 'react';
import Header from './Header';

function SavedTrips() {
    return(
        <div>
            <Header />
            <div>
                <h1>Saved Trips</h1>
                <div>
                    <p>You have no saved trips yet. Go to <a href="/trip-planner">trip planner</a> to plan a trip and save it for later.</p>
                </div>
            </div>
        </div>
    )
}

export default SavedTrips;