import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './Welcome.js';
import TrainNews from './components/TrainNews.js';
import TripSchedule from './components/VehicleRoutes.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/news" element={<TrainNews />} />
        <Route path="/schedule" element={<TripSchedule />} />
      </Routes>
    </Router>
  );
}

export default App;
