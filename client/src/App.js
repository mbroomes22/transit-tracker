import logo from './mbta.png';
import './stylesheets/App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Welcome to MBTA transit tracker.
          A project by Michelle Broomes.
        </p>
      </header>
    </div>
  );
}

export default App;
