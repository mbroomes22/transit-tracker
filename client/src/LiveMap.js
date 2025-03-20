import React, { useRef, useEffect, useState } from 'react';
import TileLayer from 'ol/layer/Tile';
import { RealtimeLayer as TrackerLayer } from 'mobility-toolbox-js/ol';
import OSM from 'ol/source/OSM';
import Map from 'ol/Map';
import View from 'ol/View';
import Overlay from 'react-spatial/components/Overlay';
import { geopsTheme } from '@geops/geops-ui';
import { responsiveFontSizes, ThemeProvider } from '@mui/material';
import Button from '@mui/material/Button';
import FitExtent from 'react-spatial/components/FitExtent';
import BasicMap from 'react-spatial/components/BasicMap';
import Geolocation from 'react-spatial/components/Geolocation';
import RouteSchedule from 'react-spatial/components/RouteSchedule';
import 'ol/ol.css';

// const extent = [-8100000, 4950000, -7900000, 5300000] // for MA
// const extent = [-7930000, 5190000, -7890000, 5230000] // for Boston, MA
const extent = [-7930000, 5195000, -7895000, 5228000]; // Approximate extent for downtown Boston, MA

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
  const [mapInitialized, setMapInitialized] = useState(false);
  const [open, setOpen] = useState(false);
  const [currentTrain, setCurrentTrain] = useState(null);
  const [trainLineColor, setTrainLineColor] = useState('black');
  const mapRef = useRef(null);
  const popupRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = new Map({
        target: 'map',
        view: new View({
          center: [-7910000, 5210000],
          zoom: 12,
        }),
        layers: layers,
        controls: [],
      });

      mapRef.current.on('click', (event) => {
          setOpen(true);
        mapRef.current.forEachFeatureAtPixel(event.pixel, (feature) => {
          const vehicleInfo = feature.getProperties(); 
          setCurrentTrain(vehicleInfo['line']['name']) 
          setTrainLineColor(vehicleInfo['line']['color'])
          // const coordinates = feature.getGeometry().getCoordinates();
        });
      });
      setMapInitialized(true);
    }
  }, []);

  return (
  <ThemeProvider theme={geopsTheme}>
    <div className="map-container" id="map">
    {mapInitialized && (
          <>
    <BasicMap map={mapRef.current} tabIndex={0} className="basic-map" />
    {open && (
        <Overlay
          observe={mapRef.current}
          className="ol-menu-wrapper"
          mobileSize={{
              minimalHeight: '25%',
              maximalHeight: '80%',
              defaultSize: {
                height: '40%',
                width: '100%',
              },
            }}
        >
          <div>
            <button
              id="popup-closer" 
              className="menu-wrapper-closer"
              onClick={() => {
                setOpen(false);
              }}
            >
              x
            </button>
            <div className='menu-collapsible-vertical'>
              <p style={{ backgroundColor:`${trainLineColor}`, color: 'white', borderRadius: '10px', border: '1px solid black'}}>Train Line: {currentTrain}</p>
              {/* <p>Vehicle ID:</p>
              <p>Current Stop:</p> */}
            </div>
          </div>
        </Overlay>)}
    <div className='geolocate'>
    <Geolocation map={mapRef.current} className="target" />
      <p>Find Me</p>
    </div>
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
        </>
    )}
    </div>
  </ThemeProvider>
);
};

export default LiveMap;