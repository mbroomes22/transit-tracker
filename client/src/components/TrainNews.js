import React, {useEffect} from 'react';
import { Link } from 'react-router-dom';

function TrainNews() {
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
                        <Link to="/page2">Train Routes</Link>
                    </li>
                </ul>
            </nav>
            <h1>Train News</h1>
            <p>Welcome to Train News!</p>
            {apiData && <div>{JSON.stringify(apiData)}</div>}
        </div>
    );
}

export default TrainNews;