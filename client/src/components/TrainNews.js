import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function TrainNews() {
    const [apiData, setApiData] = useState(null);
    const [selectedLine, setSelectedLine] = useState('');
    const subway = [ "Red", "Orange", "Blue", "Green-B", "Green-C", "Green-D", "Green-E", "Mattapan" ];
    useEffect(() => {
        // Fetch data from the backend route
        const fetchData = async () => {
          try {
            const url = selectedLine ? `/api/mbta_news_updates/${selectedLine}` : '/api/mbta_news_updates';
            const response = await axios.get(url);
            setApiData(response.data);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchData();
      }, [selectedLine]);

      const handleLineChange = (event) => {
        setSelectedLine(event.target.value);
      }

    return (
        <div>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Train Map</Link>
                    </li>
                    <li>
                        <Link to="/schedule">Train Schedule</Link>
                    </li>
                </ul>
            </nav>
            <h1>Train News</h1>
            <p>Welcome to Train News!</p>
            <label htmlFor="subway-line">Select Subway Line: </label>
            <select id="subway-line" value={selectedLine} onChange={handleLineChange}>
                <option value="">All Lines</option>
                {subway.map((line) => (
                <option key={line} value={line}>
                    {line}
                </option>
                ))}
            </select>
            {apiData && <div>{JSON.stringify(apiData)}</div>}
        </div>
    );
}

export default TrainNews;