import React, {useState} from 'react';
import basic_mbta_map from './maps/subway-map.jpg';
import mbta_downtown_map from './maps/2024-12-15-MBTA-downtown-map.png';
import bus_route_map from './maps/Bus_Routes.png';
import ne_regional_transport_map from './maps/New_England_Regional_Transportation_Map.png';
import rapid_transit_map from './maps/mbta_rapid_transit_&_commuter_rail.png';
import './stylesheets/App.css';
import LiveMap from './LiveMap.js';
import Header from './Header.js';

function MbtaTrainMap() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showLiveMap, setShowLiveMap] = useState(false);
  const [selectedMap, setSelectedMap] = useState(basic_mbta_map)
  const [mapName, setMapName] = useState('MBTA Map');

  const toggleMap = () => {
    setShowLiveMap((prevShowLiveMap) => !prevShowLiveMap);
  }

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  const handleMapSelection = (map) => {
    setSelectedMap(map);
    setIsLoaded(false);
    setMapName(getMapName(map));
  }

  const getMapName = (map) => {
    switch (map) {
      case basic_mbta_map:
        return 'MBTA Map';
      case mbta_downtown_map:
        return 'MBTA Downtown Map';
      case bus_route_map:
        return 'Bus Route Map';
      case ne_regional_transport_map:
        return 'New England Regional Transportation Map';
      case rapid_transit_map:
        return 'Rapid Transit & Commuter Rail Map';
      default:
        return '';
    }
  }
  
  return (
    <div className="App">
      <Header />
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
                    {mapName}
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