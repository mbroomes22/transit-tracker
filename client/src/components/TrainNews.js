import React from 'react';
import { Link } from 'react-router-dom';

function TrainNews() {
    return (
        <div>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Train Map</Link>
                    </li>
                    <li>
                        <Link to="/page2">Train Routes</Link>
                    </li>
                </ul>
            </nav>
            <h1>Train News</h1>
            <p>Welcome to Train News!</p>
        </div>
    );
}

export default TrainNews;