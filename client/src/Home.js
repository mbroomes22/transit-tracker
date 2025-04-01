import React from "react";


function Home() {
    return(
        <div className="home">
            <a className="home-box" href="/trip-planner">
                Plan your trip
            </a>
            <a className="home-box" href="/schedule">
                Check train schedules
            </a>
            <a className="home-box" href="/alerts">
                Get the latest service alerts
            </a>
            <a className="home-box" href="/maps">
                View the transit maps
            </a>
        </div>
    )
}

export default Home;