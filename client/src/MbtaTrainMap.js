import map from './subway-map.jpg';
import './stylesheets/App.css';

function MbtaTrainMap() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Here is the map
        </p>
        <img src={map} className="App-logo" alt="mbta logo" />
      </header>
    </div>
  );
}

export default MbtaTrainMap;