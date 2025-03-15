import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './Welcome.js';
import TrainNews from './components/TrainNews.js';
import VehicleRoutes from './components/VehicleRoutes.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/news" element={<TrainNews />} />
        <Route path="/page2" element={<VehicleRoutes />} />
      </Routes>
    </Router>
  );
}

export default App;
