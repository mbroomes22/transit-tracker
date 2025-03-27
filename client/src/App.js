import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MbtaTrainMap from './MbtaTrainMap.js';
import Welcome from './Welcome.js';
import TrainNews from './components/TrainNews.js';
import TripSchedule from './components/VehicleRoutes.js';
import TripPlanner from './TripPlanner.js';
import SavedTrips from './SavedTrips.js';
import Login from './Login.js'
import MyAccount from './MyAccount.js';
import AccountRegistration from './AccountRegistration.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/maps" element={<MbtaTrainMap />} />
        <Route path="/news" element={<TrainNews />} />
        <Route path="/schedule" element={<TripSchedule />} />
        <Route path="/trip-planner" element={<TripPlanner />} />
        <Route path="/saved-trips" element={<SavedTrips />} />
        <Route path="/my-account" element={<MyAccount />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<AccountRegistration />} />
      </Routes>
    </Router>
  );
}

export default App;
