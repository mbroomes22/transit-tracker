import React, { useRef, useEffect, useState } from 'react';
import TileLayer from 'ol/layer/Tile';
import { RealtimeLayer as TrackerLayer } from 'mobility-toolbox-js/ol';
import OSM from 'ol/source/OSM';
import Map from 'ol/Map';
import View from 'ol/View';
import { geopsTheme } from '@geops/geops-ui';
import { ThemeProvider } from '@mui/material';
import Button from '@mui/material/Button';
import FitExtent from 'react-spatial/components/FitExtent';
import BasicMap from 'react-spatial/components/BasicMap';
import Geolocation from 'react-spatial/components/Geolocation';
import RouteSchedule from 'react-spatial/components/RouteSchedule';
import 'ol/ol.css';

// const extent = [-13884991, 2870341, -7455066, 6338219]; for USA
// const extent = [-8100000, 4950000, -7900000, 5300000] // for MA
const extent = [-7930000, 5190000, -7890000, 5230000] // for Boston, MA

const trackerLayer = new TrackerLayer({
  url: 'wss://api.geops.io/tracker-ws/v1/ws',
  apiKey: process.env.REACT_APP_GEOPS_API_KEY,
});

const layers = [
  new TileLayer({
    source: new OSM(),
  }),
  trackerLayer,
];

const LiveMap = () => {
  const [lineInfos, setLineInfos] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = new Map({
        target: 'map',
        view: new View({
          center: [-7910000, 5210000],
          zoom: 4,
        }),
        layers: layers,
        controls: [],
      });
    }
  }, []);

  return (
  <ThemeProvider theme={geopsTheme}>
    <div className="map-container" id="map">
    <BasicMap map={mapRef.current} tabIndex={0} className="basic-map" />
    <Geolocation map={mapRef.current} />
    <FitExtent map={mapRef.current} extent={extent}>
      <Button>
        Fit to Boston
      </Button>
    </FitExtent>
    <RouteSchedule
          lineInfos={lineInfos}
          trackerLayer={trackerLayer}
          renderHeaderButtons={(routeIdentifier) => (
            <Button onClick={() => setLineInfos(null)}>Clear</Button>
          )}
        />
    </div>
  </ThemeProvider>
);
};

export default LiveMap;