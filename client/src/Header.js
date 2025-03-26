import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';

function Header() {
    // create a nav menu
    // Transit Tracker name should be centered
    // links should be on the left in a hamburger menu dropdown
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return(
        <div>
            <nav>
                <div>
                    <Button
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                    >
                        {MenuIcon}
                    </Button>
                    <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                    'aria-labelledby': 'basic-button',
                    }}
                    >
                        <MenuItem onClick={handleClose}>
                            <Link to="/">Home</Link>
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                            <Link to="/maps">Train Map</Link>
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                            <Link to="/news">Train News</Link>
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                            <Link to="/schedule">Train Schedule</Link>
                        </MenuItem>
                    </Menu>
                </div>

                <div>
                    Transit Tracker
                </div>
            </nav>
        </div>
    )
}

export default Header;