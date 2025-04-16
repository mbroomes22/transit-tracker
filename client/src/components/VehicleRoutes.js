import React, {useEffect, useState, useCallback, useMemo} from 'react';
import Header from '../Header.js';
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
    const inboundDirections = useMemo(() => ["Inbound", "East", "South"], []);
    const outboundDirections = useMemo(() => ["Outbound", "West", "North"], []);

    const organizeSchedule = useCallback((schedule) => {
        const inbound = schedule.filter((trip) => inboundDirections.includes(trip.train_direction))
        const outbound = schedule.filter((trip) => outboundDirections.includes(trip.train_direction))
        setInboundTrip(inbound);
        setOutboundTrip(outbound);
    }, [inboundDirections, outboundDirections])

    const routeDistance = useCallback((schedule, direction) => {
        const firstArrivalNull = schedule.find((trip) => trip.arrival_time === null && direction.includes(trip.train_direction)); // change here too
        const firstDepartureNull = schedule.find((trip) => trip.departure_time === null  && direction.includes(trip.train_direction)); // change here too
        const dist = (firstDepartureNull["stop_id"] + 1) - firstArrivalNull["stop_id"];
        if (inboundDirections === direction){
            setInboundRouteDist(dist);
        } else {
            setOutboundRouteDist(dist);
        }
    }, [inboundDirections])

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
            routeDistance(response.data, inboundDirections); // include "East", "South"
            routeDistance(response.data, outboundDirections); // include "West", "North"
            } catch (error) {
            console.error('Error fetching data:', error);
            }
        };
    
        fetchData();
        }, [organizeSchedule, routeDistance, selectedLine, inboundDirections, outboundDirections]);

        useEffect(() => {
            window.history.pushState(
                null,
                "",
                `${selectedLine ? `/schedule/${selectedLine}` : '/schedule'}`,
              )
        }, [selectedLine]);
        
        const handleLineChange = (event) => {
            setSelectedLine(event.target.value);
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
            let currentStopSequence = tripArray[tripIndex]?.stop_id;
            for (let i = tripIndex; i < tripIndex + routeDistance; i++) {
              if (tripArray[i].stop_id === currentStopSequence) {
                tripStops.push(tripArray[i]);
                currentStopSequence++;
              } else {
                break;
              }
            }
            return tripStops;
          };

        const inboundTripStops = getTripStops(inboundTrip, currentInboundTripIndex, inboundRouteDist).sort((a, b) => a.stop_id - b.stop_id);;
        const outboundTripStops = getTripStops(outboundTrip, currentOutboundTripIndex, outboundRouteDist).sort((a, b) => a.stop_id - b.stop_id);;
    return (
        <div>
            <Header />
            <div className="intro-block">
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
            </div>
            {apiData && (
                <div className='route-schedules'>
                    <div className="route">
                        <button onClick={handlePreviousInboundTrip} disabled={currentInboundTripIndex === 0}>Previous Trip</button>
                        <button onClick={handleNextInboundTrip} disabled={currentInboundTripIndex + inboundRouteDist >= inboundTrip.length}>Next Trip</button>
                        <h3>{inboundTripStops[0].train_direction}</h3>                      
                        <h3>Heading to {inboundTripStops[0].train_destination}</h3>
                        {inboundTripStops.map((stop, idx) => (
                            <div className="stop" key={idx}>
                                <p>Stop # {(stop.stop_id % inboundRouteDist) + 1}: {stop.current_stop_name}</p>
                                <p>Arrival Time: {stop.arrival_time || "First Stop"}</p>
                                <p>Departure Time: {stop.departure_time || "Last Stop"}</p>
                            </div>
                        ))}
                    </div>
                    <div className="route">
                    <button onClick={handlePreviousOutboundTrip} disabled={currentOutboundTripIndex === 0}>Previous Trip</button>
                    <button onClick={handleNextOutboundTrip} disabled={currentOutboundTripIndex + outboundRouteDist >= outboundTrip.length}>Next Trip</button>
                        <h3>{outboundTripStops[0].train_direction}</h3>
                        <h3>Heading to {outboundTripStops[0].train_destination}</h3>
                        {outboundTripStops.map((stop, idx) => (
                            <div className="stop" key={idx}>
                                <p>Stop # {(stop.stop_id % outboundRouteDist) + 1}: {stop.current_stop_name}</p>
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