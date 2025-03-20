import React, {useState} from 'react';
import basic_mbta_map from './maps/subway-map.jpg';
import mbta_downtown_map from './maps/2024-12-15-MBTA-downtown-map.png';
import bus_route_map from './maps/Bus_Routes.png';
import ne_regional_transport_map from './maps/New_England_Regional_Transportation_Map.png';
import rapid_transit_map from './maps/mbta_rapid_transit_&_commuter_rail.png';
import './stylesheets/App.css';
import LiveMap from './LiveMap.js';

function MbtaTrainMap() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showLiveMap, setShowLiveMap] = useState(false);
  const [selectedMap, setSelectedMap] = useState(basic_mbta_map)

  const toggleMap = () => {
    setShowLiveMap((prevShowLiveMap) => !prevShowLiveMap);
  }

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  const handleMapSelection = (map) => {
    setSelectedMap(map);
    setIsLoaded(false);
  }
  
  return (
    <div className="App">
      <header className="App-header">
        <button onClick={toggleMap} className="switch-map">
          {showLiveMap ? 'Show Static Map' : 'Show Live Map'}
        </button>
        {showLiveMap ? (<LiveMap />) : (
          <>
          <div className="static-map-container">
            <nav className = "map-nav">
              <button onClick={() => handleMapSelection(basic_mbta_map)}>MBTA map</button>
              <button onClick={() => handleMapSelection(mbta_downtown_map)}>MBTA Downtown map</button>
              <button onClick={() => handleMapSelection(bus_route_map)}>Bus Route map</button>
              <button onClick={() => handleMapSelection(ne_regional_transport_map)}>NE Regional Transport map</button>
              <button onClick={() => handleMapSelection(rapid_transit_map)}>Rapid Transit map</button>
            </nav>
            <div className="map-content">
              {isLoaded ? (
                <div>
                  <p>
                    MBTA map
                  </p>
                </div>
                ) : (
              <div className="placeholder">
                Loading Map...
                </div>
              )}
              <img 
              src={selectedMap} 
              className="App-logo" 
              alt="mbta logo" 
              onLoad={handleImageLoad} 
              />
          </div>
        </div>
        </>
        )
      }
      </header>
    </div>
  );
}

export default MbtaTrainMap;