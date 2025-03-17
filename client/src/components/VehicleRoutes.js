import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function TripSchedule() {
    const [apiData, setApiData] = useState(null);
    const [inboundRouteDist, setInboundRouteDist] = useState(0)
    const [outboundRouteDist, setOutboundRouteDist] = useState(0)
    const [inboundTrip, setInboundTrip] = useState([]);
    const [outboundTrip, setOutboundTrip] = useState([]);
    const [currentInboundTripIndex, setCurrentInboundTripIndex] = useState(0)
    const [currentOutboundTripIndex, setCurrentOutboundTripIndex] = useState(0)

    useEffect(() => {
        // Fetch data from the backend route
        const fetchData = async () => {
            try {
            const response = await axios.get('/api/mbta_schedule', {
                params: {
                    filter: {
                        route: 23
                    }
                }
            });
            setApiData(response.data);
            organizeSchedule(response.data);
            routeDistance(response.data, "Inbound");
            routeDistance(response.data, "Outbound");
            } catch (error) {
            console.error('Error fetching data:', error);
            }
        };
    
        fetchData();
        }, []);

        const organizeSchedule = (schedule) => {
            const inbound = schedule.filter((trip) => trip.train_direction === "Inbound")
            const outbound = schedule.filter((trip) => trip.train_direction === "Outbound")
            setInboundTrip(inbound);
            setOutboundTrip(outbound);
        }

        const routeDistance = (schedule, direction) => {
            const firstArrivalNull = schedule.find((trip) => trip.arrival_time === null && trip.train_direction === direction);
            const firstDepartureNull = schedule.find((trip) => trip.departure_time === null  && trip.train_direction === direction);
            const dist = (firstDepartureNull["stop_sequence_num"] + 1) - firstArrivalNull["stop_sequence_num"];
            if (direction === "Inbound"){
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
            {apiData && (
                <div>
                    <div>
                        <button onClick={handlePreviousInboundTrip} disabled={currentInboundTripIndex === 0}>Previous Trip</button>
                        <button onClick={handleNextInboundTrip} disabled={currentInboundTripIndex + inboundRouteDist >= inboundTrip.length}>Next Trip</button>
                        <h3>Inbound</h3>
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
                        <h3>Outbound</h3>
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