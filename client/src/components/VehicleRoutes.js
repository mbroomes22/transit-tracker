import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function TripSchedule() {
    const [apiData, setApiData] = useState(null);
    useEffect(() => {
        // Fetch data from the backend route
        const fetchData = async () => {
            try {
            const response = await axios.get('/api/mbta_schedule');
            setApiData(response.data);
            } catch (error) {
            console.error('Error fetching data:', error);
            }
        };
    
        fetchData();
        }, []);
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
            <h1>Trip Schedule</h1>
            <p>Welcome to Trip Schedule!</p>
            {apiData && <div>{JSON.stringify(apiData)}</div>}
        </div>
    );
}

export default TripSchedule;