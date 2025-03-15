import React, { useState, useEffect, useRef } from 'react';
// send & receive realtime messages from geops.io's websocket server
// displays map with realtime routeschedule info, including stops & punctuality info related to clicked route.
import { RealtimeLayer } from 'mobility-toolbox-js/ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import BasicMap from 'react-spatial/components/BasicMap';
import RouteSchedule from 'react-spatial/components/RouteSchedule';
import { ToggleButton } from '@mui/material';
import { FaFilter } from 'react-icons/fa';
import { GpsFixed as GpsFixedIcon } from '@mui/icons-material';
// geolocates the user and displays their location on the map
import Geolocation from 'react-spatial/components/Geolocation';
import 'ol/ol.css';
import 'react-spatial/themes/default/index.scss';
import './stylesheets/App.css'; // Ensure you import your CSS file

console.log("Initializing LiveMap component");

const trackerLayer = new RealtimeLayer({
  url: 'wss://api.geops.io/tracker-ws/v1/ws',
  apiKey: process.env.REACT_APP_GEOPS_API_KEY,
});

// Logging to verify
console.log("WebSocket URL:", 'wss://api.geops.io/tracker-ws/v1/ws');
console.log("API Key:", process.env.REACT_APP_GEOPS_API_KEY);

trackerLayer.on('message', (message) => {
  console.log('Received message from WebSocket:', message);
});

trackerLayer.on('error', (error) => {
  console.error('WebSocket error:', error);
});

trackerLayer.on('open', () => {
  console.log('WebSocket connection opened');
  // Send BBOX message after connection is opened
  const bboxMessage = `BBOX 797797 5917228.5 856296 5950915 12`;
  console.log('Sending BBOX message:', bboxMessage);
  trackerLayer.send(bboxMessage);
});

trackerLayer.on('close', (event) => {
  console.log('WebSocket connection closed:', event);
});

const layers = [
  new TileLayer({
    source: new OSM(),
  }),
  trackerLayer,
];

let updateInterval;

const getVehicleCoord = (routeIdentifier) => {
  const [trajectory] = trackerLayer.getVehicle((traj) => {
    return traj.properties.route_identifier === routeIdentifier;
  });
  return trajectory && trajectory.properties.coordinate;
};

function LiveMap() {
  const [lineInfos, setLineInfos] = useState(null);
  const [filterActive, setFilterActive] = useState(false);
  const [followActive, setFollowActive] = useState(false);
  const [center, setCenter] = useState([797797, 5917228.5, 856296, 5950915]);
  const [feature, setFeature] = useState();
  const mapRef = useRef(null);

  useEffect(() => {
    console.log("useEffect for feature change");
    let vehicleId = null;
    if (feature) {
      vehicleId = feature.get('train_id');
      trackerLayer.api.subscribeStopSequence(vehicleId, ({ content: [stopSequence] }) => {
        if (stopSequence) {
          setLineInfos(stopSequence);
        }
      });
    } else {
      setLineInfos();
    }
    return () => {
      if (vehicleId) {
        trackerLayer.api.unsubscribeStopSequence(vehicleId);
      }
    };
  }, [feature]);

  useEffect(() => {
    console.log("useEffect for mapRef.current");
    if (mapRef.current) {
      mapRef.current.on('click', (event) => {
        const clickedFeature = mapRef.current.forEachFeatureAtPixel(event.pixel, (feature) => feature);
        setFeature(clickedFeature);
      });
    }
  }, []); // Run only once after initial render

  useEffect(() => {
    console.log("useEffect for lineInfos change");
    if (mapRef.current) {
      mapRef.current.updateSize();
    }
  }, [lineInfos]);

  return (
    <div className="rt-route-schedule-example">
      <RouteSchedule
        lineInfos={lineInfos}
        trackerLayer={trackerLayer}
        renderHeaderButtons={routeIdentifier => (
          <>
            <ToggleButton
              value="filter"
              selected={filterActive}
              onClick={() => {
                if (!filterActive) {
                  trackerLayer.filter = (trajectory) => {
                    return trajectory.properties.route_identifier === routeIdentifier;
                  };
                } else {
                  trackerLayer.filter = null;
                }
                setFilterActive(!filterActive);
              }}>
              <FaFilter />
            </ToggleButton>
            <ToggleButton
              value="follow"
              selected={followActive}
              onClick={() => {
                clearInterval(updateInterval);
                if (!followActive) {
                  updateInterval = window.setInterval(() => {
                    const coord = getVehicleCoord(routeIdentifier);
                    if (coord) {
                      setCenter(coord);
                    }
                  }, 50);
                }
                setFollowActive(!followActive);
              }}>
              <GpsFixedIcon />
            </ToggleButton>
          </>
        )}
      />
      <div className="map-container">
        <BasicMap
          center={center}
          zoom={12}
          layers={layers}
          tabIndex={0}
          mapRef={mapRef}
        />
      </div>
      {mapRef.current && <Geolocation map={mapRef.current} />}
    </div>
  );
}

export default LiveMap;