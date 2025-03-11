import React, {useState, useEffect} from 'react';
import EntryScreen from './EntryScreen.js';
import MbtaTrainMap from './MbtaTrainMap.js';

function Welcome() {
    localStorage.clear() // remove this line to see the welcome screen only once
    const [showWelcome, setShowWelcome] = useState(false);

    useEffect(() => {
        const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');

        if (!hasSeenWelcome) {
            setShowWelcome(true) // show welcome only if not seen before

            const timer = setTimeout(() => {
                setShowWelcome(false);

                localStorage.setItem('hasSeenWelcome', true)
            }, 3000) // 3 sec
            return () => clearTimeout(timer) // cleanup on unmount
        }
    }, [])

    return (
        <div>
            {showWelcome && <div className="welcome-screen"><EntryScreen /></div>}
            {!showWelcome && <div><MbtaTrainMap /></div>}
        </div>
    )
}

export default Welcome;


