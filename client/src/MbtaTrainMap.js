import React, {useState} from 'react';
import map from './subway-map.jpg';
import './stylesheets/App.css';
// import LiveMap from './LiveMap.js';

function MbtaTrainMap() {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div className="App">
      <header className="App-header">
        {isLoaded ? 
        <div>
          <p>
            Here is the map
          </p>
        </div>
         : 
         <div className='placeholder'>
          Loading Map...
          </div>}
         <img 
        src={map} 
        className="App-logo" 
        alt="mbta logo" 
        onLoad={handleImageLoad}
        />
      </header>
    </div>
  );
}

export default MbtaTrainMap;