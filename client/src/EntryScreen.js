import React from 'react';
import logo from './maps/mbta.png';
import './stylesheets/App.css';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

function EntryScreen({onCheckboxChange}) {
  const handleCheckboxChange = (event) => {
    onCheckboxChange(event.target.checked);
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="mbta logo" />
        <p>
          Welcome to MBTA transit tracker.
          A project by Michelle Broomes.
        </p>
        <FormControlLabel
                className='checkbox'
                control={<Checkbox onChange={handleCheckboxChange} color="primary" />}
                label="Don't show this screen again"
                />
      </header>
    </div>
  );
}

export default EntryScreen;