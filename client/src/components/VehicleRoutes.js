import React from 'react';
import { Link } from 'react-router-dom';

function TripRoutes() {
    return (
        <div>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Train Map</Link>
                    </li>
                    <li>
                        <Link to="/news">Train News</Link>
                    </li>
                </ul>
            </nav>
            <h1>Trip Routes</h1>
            <p>Welcome to Trip Routes!</p>
        </div>
    );
}

export default TripRoutes;