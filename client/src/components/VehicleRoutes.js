import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function TripSchedule() {
    const [apiData, setApiData] = useState(null);
    const [selectedLine, setSelectedLine] = useState('Mattapan')
    const [inboundRouteDist, setInboundRouteDist] = useState(0)
    const [outboundRouteDist, setOutboundRouteDist] = useState(0)
    const [inboundTrip, setInboundTrip] = useState([]);
    const [outboundTrip, setOutboundTrip] = useState([]);
    const [currentInboundTripIndex, setCurrentInboundTripIndex] = useState(0)
    const [currentOutboundTripIndex, setCurrentOutboundTripIndex] = useState(0)
    const subway = [ "Red", "Orange", "Blue", "Green-B", "Green-C", "Green-D", "Green-E", "Mattapan" ];
    const inboundDirections = ["Inbound", "East", "South"];
    const outboundDirections = ["Outbound", "West", "North"];

    useEffect(() => {
        // Fetch data from the backend route
        const fetchData = async () => {
            try {
            const response = await axios.get('/api/mbta_schedule', {
                params: {
                    filter: {
                        route: {selectedLine}
                    }
                }
            });
            setApiData(response.data);
            organizeSchedule(response.data);
            routeDistance(response.data, "Inbound"); // include "East", "South"
            routeDistance(response.data, "Outbound"); // include "West", "North"
            } catch (error) {
            console.error('Error fetching data:', error);
            }
        };
    
        fetchData();
        }, []);

        const handleLineChange = (event) => {
            setSelectedLine(event.target.value);
        }

        const organizeSchedule = (schedule) => {
            const inbound = schedule.filter((trip) => inboundDirections.includes(trip.train_direction))
            const outbound = schedule.filter((trip) => outboundDirections.includes(trip.train_direction))
            setInboundTrip(inbound);
            setOutboundTrip(outbound);
        }

        const routeDistance = (schedule, direction) => {
            const firstArrivalNull = schedule.find((trip) => trip.arrival_time === null && trip.train_direction === direction); // change here too
            const firstDepartureNull = schedule.find((trip) => trip.departure_time === null  && trip.train_direction === direction); // change here too
            const dist = (firstDepartureNull["stop_sequence_num"] + 1) - firstArrivalNull["stop_sequence_num"];
            if (inboundDirections.includes(direction)){
                setInboundRouteDist(dist);
            } else {
                setOutboundRouteDist(dist);
            }
        }

        const handleNextInboundTrip = () => {
            setCurrentInboundTripIndex((prevIndex) => Math.min(prevIndex + inboundRouteDist, inboundTrip.length - 1));
        }

        const handleNextOutboundTrip = () => {
            setCurrentOutboundTripIndex((prevIndex) => Math.min(prevIndex + outboundRouteDist, outboundTrip.length - 1));
        }

        const handlePreviousInboundTrip = () => {
            setCurrentInboundTripIndex((prevIndex) => Math.max(prevIndex - inboundRouteDist, 0));
        }

        const handlePreviousOutboundTrip = () => {
            setCurrentOutboundTripIndex((prevIndex) => Math.max(prevIndex - outboundRouteDist, 0));
        }

       

        const getTripStops = (tripArray, tripIndex, routeDistance) => {
            const tripStops = [];
            let currentStopSequence = tripArray[tripIndex]?.stop_sequence_num;
            for (let i = tripIndex; i < tripIndex + routeDistance; i++) {
              if (tripArray[i].stop_sequence_num === currentStopSequence) {
                tripStops.push(tripArray[i]);
                currentStopSequence++;
              } else {
                break;
              }
            }
            return tripStops;
          };

        const inboundTripStops = getTripStops(inboundTrip, currentInboundTripIndex, inboundRouteDist);
        const outboundTripStops = getTripStops(outboundTrip, currentOutboundTripIndex, outboundRouteDist);
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
            <label htmlFor="subway-line">Select Subway Line: </label>
            <select id="subway-line" value={selectedLine} onChange={handleLineChange}>
                <option value="Mattapan">Mattapan</option>
                {subway.map((line) => (
                <option key={line} value={line}>
                    {line}
                </option>
                ))}
            </select>
            {apiData && (
                <div>
                    <div>
                        <button onClick={handlePreviousInboundTrip} disabled={currentInboundTripIndex === 0}>Previous Trip</button>
                        <button onClick={handleNextInboundTrip} disabled={currentInboundTripIndex + inboundRouteDist >= inboundTrip.length}>Next Trip</button>
                        <h3>{inboundTripStops[0].train_direction}</h3>                      
                        <h3>Heading to {inboundTripStops[0].train_destination}</h3>
                        {inboundTripStops.map((stop, idx) => (
                            <div key={idx}>
                                <p>Stop # {stop.stop_sequence_num}: {stop.current_stop_name}</p>
                                <p>Arrival Time: {stop.arrival_time || "First Stop"}</p>
                                <p>Departure Time: {stop.departure_time || "Last Stop"}</p>
                            </div>
                        ))}
                    </div>
                    <div>
                    <button onClick={handlePreviousOutboundTrip} disabled={currentOutboundTripIndex === 0}>Previous Trip</button>
                    <button onClick={handleNextOutboundTrip} disabled={currentOutboundTripIndex + outboundRouteDist >= outboundTrip.length}>Next Trip</button>
                        <h3>{outboundTripStops[0].train_direction}</h3>
                        <h3>Heading to {outboundTripStops[0].train_destination}</h3>
                        {outboundTripStops.map((stop, idx) => (
                            <div key={idx}>
                                <p>Stop # {stop.stop_sequence_num}: {stop.current_stop_name}</p>
                                <p>Arrival Time: {stop.arrival_time || "First Stop"}</p>
                                <p>Departure Time: {stop.departure_time || "Last Stop"}</p>
                            </div>
                        ))}
                    </div>
                </div>
                )
                }
        </div>
    );
}

export default TripSchedule;