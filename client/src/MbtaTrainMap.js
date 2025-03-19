import React, {useState} from 'react';
import map from './subway-map.jpg';
import './stylesheets/App.css';
import LiveMap from './LiveMap.js';

function MbtaTrainMap() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showLiveMap, setShowLiveMap] = useState(false);

  const toggleMap = () => {
    setShowLiveMap((prevShowLiveMap) => !prevShowLiveMap);
  }

  const handleImageLoad = () => {
    setIsLoaded(true);
  };
  
  return (
    <div className="App">
      <header className="App-header">
        <button onClick={toggleMap}>
          {showLiveMap ? 'Show Static Map' : 'Show Live Map'}
        </button>
        {showLiveMap ? (<LiveMap />) : (
          <>
        {isLoaded ? (
          <div>
            <p>
              MBTA map
            </p>
          </div>
          ) : (
         <div className='placeholder'>
          Loading Map...
          </div>
        )}
         <img 
        src={map} 
        className="App-logo" 
        alt="mbta logo" 
        onLoad={handleImageLoad} 
        />
        </>
        )
      }
      </header>
    </div>
  );
}

export default MbtaTrainMap;