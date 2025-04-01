import React from 'react';
import './stylesheets/App.css';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import greyMbtaTrainPlatform from './stock-photos/greyMbtaTrainPlatform.mp4';

function EntryScreen({onCheckboxChange}) {
  const handleCheckboxChange = (event) => {
    onCheckboxChange(event.target.checked);
  }

  return (
    <div className="App-entry">
      {/* Background video */}
      <video autoPlay muted className="background-video" src={greyMbtaTrainPlatform} type="video/mp4"/>

      {/* Content */}
       <header className="App-header">
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