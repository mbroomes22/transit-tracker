import React, {useEffect, useState} from 'react';
import Header from '../Header.js';
import axios from 'axios';

function TrainNews() {
    const [apiData, setApiData] = useState(null);
    const [selectedLine, setSelectedLine] = useState('');
    const [selectedMoreInfo, setSelectedMoreInfo] = useState(null);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const subway = [ "Red", "Orange", "Blue", "Green-B", "Green-C", "Green-D", "Green-E", "Mattapan" ];
    useEffect(() => {
        // Fetch data from the backend route
        const fetchData = async () => {
          try {
            const url = selectedLine ? `/api/mbta_news_updates/${selectedLine}?page=${page}&per_page=${perPage}` 
            : `/api/mbta_news_updates?page=${page}&per_page=${perPage}`;
            const response = await axios.get(url);
            setApiData(response.data);
            setTotalItems(response.data.total_items);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchData();
      }, [selectedLine, page, perPage]);

      const handleLineChange = (event) => {
        setSelectedLine(event.target.value);
        setPage(1)
      }

      const handlePerPageChange = (event) => {
        setPerPage(parseInt(event.target.value, 10));
        setPage(1);
      }

      const handleClick = (key) => {
        setSelectedMoreInfo(selectedMoreInfo === key ? null : key);
      }

      const handleNextPage = () => {
        setPage((prevPage) => prevPage + 1);
      }

      const handlePreviousPage = () => {
        setPage((prevPage) => Math.max(prevPage - 1, 1));
      }

      const totalPages = Math.ceil(totalItems / perPage);

    return (
        <div>
            <Header />
            <div className="intro-block">
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
            <label htmlFor="per-page">Items per Page:</label>
            <select id="per-page" value={perPage} onChange={handlePerPageChange}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
            </select>
            </div>
            {apiData && (
                <div>
                { Object.entries(apiData.alerts).map(([key, value]) => (
                    <div className="news-update" key={key}>
                        <h3>{value.date}</h3>
                        <h4>{value.title}</h4>
                        <p>{value.summary}</p>
                        {value.description && (
                            <div onClick={() => handleClick(key)}>
                                <p className='more-info'>More Info...</p>
                                {selectedMoreInfo === key && <p>{value.description}</p>}
                            </div>
                        )}
                    </div>
                ))}
                <div className="intro-block">
                <p>page {page} of {totalPages}</p>
                    <div>
                        <button onClick={handlePreviousPage} disabled={page === 1}>
                            Previous Page
                        </button>
                        <button onClick={handleNextPage} disabled={page >= totalPages}>
                            Next Page
                        </button>
                    </div>
                    </div>
                </div>)}
        </div>
    );
}

export default TrainNews;