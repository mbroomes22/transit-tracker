import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import Tooltip from '@mui/material/Tooltip';
import Logout from '@mui/icons-material/Logout';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import Settings from '@mui/icons-material/Settings';


// create a nav menu
// Transit Tracker name should be centered
// links should be on the left in a hamburger menu dropdown
function Header() {
    const isLoggedIn = false; // Replace with actual authentication logic
    // State for the hamburger menu
    const [hamburgerAnchorEl, setHamburgerAnchorEl] = useState(null);
    const hamburgerOpen = Boolean(hamburgerAnchorEl);

    const handleHamburgerClick = (event) => {
        setHamburgerAnchorEl(event.currentTarget);
    };
    const handleHamburgerClose = () => {
        setHamburgerAnchorEl(null);
    };

    // State for the settings menu
    const [settingsAnchorEl, setSettingsAnchorEl] = useState(null);
    const settingsOpen = Boolean(settingsAnchorEl);

    const handleSettingsClick = (event) => {
        setSettingsAnchorEl(event.currentTarget);
    };

    const handleSettingsClose = () => {
        setSettingsAnchorEl(null);
    };

    return(
        <div>
            <nav className='nav-bar'>
                {/* Hamburger Menu */}
                <div>
                    <Tooltip title="Explore">
                        <Button
                        id="hamburger-button"
                        aria-controls={hamburgerOpen ? 'hamburger-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={hamburgerOpen ? 'true' : undefined}
                        onClick={handleHamburgerClick}
                        >
                            <MenuIcon />
                        </Button>
                    </Tooltip>
                    <Menu
                    id="hamburger-menu"
                    anchorEl={hamburgerAnchorEl}
                    open={hamburgerOpen}
                    onClose={handleHamburgerClose}
                    MenuListProps={{
                    'aria-labelledby': 'hamburger-button',
                    }}
                    >
                        <MenuItem onClick={handleHamburgerClose}>
                            <Link to="/">Home</Link>
                        </MenuItem>
                        <MenuItem onClick={handleHamburgerClose}>
                            <Link to="/maps">Train Map</Link>
                        </MenuItem>
                        <MenuItem onClick={handleHamburgerClose}>
                            <Link to="/trip-planner">Trip Planner</Link>
                        </MenuItem>
                        <MenuItem onClick={handleHamburgerClose}>
                            <Link to="/news">Train News</Link>
                        </MenuItem>
                        <MenuItem onClick={handleHamburgerClose}>
                            <Link to="/schedule">Train Schedule</Link>
                        </MenuItem>
                    </Menu>
                </div>

                {/* Website Title */}
                <div style={{cursor: 'default'}}>
                    Transit Tracker
                </div>
                
                {/* Settings Menu */}
                <div>
                    <Tooltip title="Settings">
                        <Button
                         id="settings-button"
                         aria-controls={settingsOpen ? 'settings-menu' : undefined}
                         aria-haspopup="true"
                         aria-expanded={settingsOpen ? 'true' : undefined}
                         onClick={handleSettingsClick}
                         size="small"
                         sx={{ ml: 2 }}
                        >
                            <SettingsIcon />
                        </Button>
                    </Tooltip>
                    <Menu 
                        id="settings-menu"
                        anchorEl={settingsAnchorEl}
                        open={settingsOpen}
                        onClose={handleSettingsClose}
                        MenuListProps={{
                            'aria-labelledby': 'settings-button',
                        }}
                    >
                        {isLoggedIn && (
                             <div>
                                <MenuItem onClick={handleSettingsClose}>
                                    <Link to="/my-account">My Account</Link>
                                </MenuItem>
                                <Divider key="divider" />
                                <MenuItem onClick={handleSettingsClose}>
                                    <ListItemIcon>
                                        <Settings fontSize="small" />
                                    </ListItemIcon>
                                    <Link to="/saved-trips">Saved Trips</Link>
                                </MenuItem>
                            </div>) 
                        }
                        <MenuItem onClick={handleSettingsClose}>
                            <ListItemIcon>
                                <Logout fontSize="small" />
                            </ListItemIcon>
                            {isLoggedIn ? <Link to="/logout">Logout</Link> : <Link to="/login">Login</Link>}
                        </MenuItem>
                    </Menu>
                </div>
            </nav>
        </div>
    )
}

export default Header;