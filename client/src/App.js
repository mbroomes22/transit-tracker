import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MbtaTrainMap from './MbtaTrainMap.js';
import Welcome from './Welcome.js';
import TrainNews from './components/TrainNews.js';
import TripSchedule from './components/VehicleRoutes.js';
import TripPlanner from './TripPlanner.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/maps" element={<MbtaTrainMap />} />
        <Route path="/news" element={<TrainNews />} />
        <Route path="/schedule" element={<TripSchedule />} />
        <Route path="/trip-planner" element={<TripPlanner />} />
      </Routes>
    </Router>
  );
}

export default App;
