import React, {useState, useEffect} from 'react';
import Header from './Header.js';
import EntryScreen from './EntryScreen.js';
import Home from './Home.js';

function Welcome() {
    const [hideWelcome, setHideWelcome] = useState(() => {
        return localStorage.getItem('hideWelcome') === 'true';
    });
    const [showWelcome, setShowWelcome] = useState(false);
    
    useEffect(() => {
        if (!hideWelcome) {
            localStorage.clear() // allows user to see welcome screen every page visit
        }
    }, [hideWelcome]);

    useEffect(() => {
        const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');

        if (!hasSeenWelcome && !hideWelcome) {
            setShowWelcome(true) // show welcome only if not seen before

            const timer = setTimeout(() => {
                setShowWelcome(false);

                localStorage.setItem('hasSeenWelcome', true)
            }, 5000) // 5 sec
            return () => clearTimeout(timer) // cleanup on unmount
        } else {
            setShowWelcome(false) // hide welcome screen if already seen or hideWelcome is true
        }
    }, [hideWelcome])

    const handleCheckboxChange = (checked) => {
        setHideWelcome(checked);
        localStorage.setItem('hideWelcome', checked); // store the state in local storage
        if (checked) {
            setShowWelcome(false); // hide welcome screen immediately if checkbox is checked
        }
    }

    return (
        <div>
            {showWelcome && <div className="welcome-screen"><EntryScreen onCheckboxChange={handleCheckboxChange} /></div>}
            {!showWelcome && (
                <div>
                    <Header />
                    <Home />
                </div>
                )}
        </div>
    )
}

export default Welcome;


