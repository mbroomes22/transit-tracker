import React, {useState} from "react";
import Header from './Header.js';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import Snackbar from "@mui/material/Snackbar";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

function TripPlanner() {
    const [savedTrip, setSavedTrip] = useState(false); // Replace with actual logic to check if the trip is saved
    const [open, setOpen] = React.useState(false);

    const handleSave = () => {
        // Logic to save the trip
        setSavedTrip(true);
        console.log("Trip saved!");
    }
    const handleDelete = () => {
        // Logic to delete the trip
        setSavedTrip(false);
        console.log("Trip deleted!");
    }


  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

    const action = (
        <React.Fragment>
          <button 
          color="secondary" 
          size="small" 
          onClick={() => {
            handleClose();
            handleDelete();
            }}>
            UNDO
          </button>
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </React.Fragment>
      );

    return(
        <div>
            <Header />
            <div className="trip-planner">
                <h2>Plan Your Trip</h2>
                <div className="trip-planner-container">
                    <form>
                        <div>
                            <label htmlFor="start-location">Start Location:</label>
                            <input type="text" id="start-location" name="start-location" required />
                        </div>
                        <div>
                            <label htmlFor="end-location">End Location:</label>
                            <input type="text" id="end-location" name="end-location" required />
                        </div>
                        <button type="submit">Get Directions</button>
                    </form>
                    <div className="trip-results">
                        <h3>Trip Results</h3>
                        <p>Your trip details will appear here.</p>
                        <div>
                            <p> Save this trip </p>
                            {savedTrip ? (
                                <button className="save-trip-button" onClick={handleDelete}><BookmarkIcon /></button>
                                ) : (
                                <button 
                                className="save-trip-button" 
                                onClick={() => {
                                    handleSave(); 
                                    handleClick();
                                }}
                                ><BookmarkBorderIcon /></button>
                            )}
                            <Snackbar
                            open={open}
                            autoHideDuration={8000}
                            onClose={handleClose}
                            message="Trip saved!"
                            action={action}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TripPlanner;