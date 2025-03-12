import React, {useState, useEffect} from 'react';
import io from 'WebSocket.io-client';


// const BACKEND = process.env.GEOPS_API_KEY;
const BACKEND = 'geops-api'

const SOCKET_URL = `wss://api.geops.io/tracker-ws/dev?key=${BACKEND}/`;
function LiveMap() {
    const [data, setData] = useState(null);

    useEffect(() => {
        const socket = io(SOCKET_URL, {
            transports: ['websocket']
        });

        socket.on('connect', () => {
            console.log('Connected to the server');
        });

        socket.on('message', (message) => {
            console.log('Received message:', message);
            setData(message);
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from the server');
        });

        return () => {
            socket.disconnect();
        }
    }, [])

    return (
        <div>
            <h1>Live Map</h1>
            {data ? (
                <pre>{JSON.stringify(data, null, 2)}</pre>
            ) : (
                <p>Loading data...</p>
            )}
        </div>
    );
}

export default LiveMap;