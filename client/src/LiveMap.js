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

//  for the train route?
// const getVehicleCoord = (routeIdentifier) => {
//   const [trajectory] = trackerLayer.getVehicle((traj) => {
//     return traj.properties.route_identifier === routeIdentifier;
//   });
//   return trajectory && trajectory.properties.coordinate;
// };

const LiveMap = () => {
  const [lineInfos, setLineInfos] = useState(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [open, setOpen] = useState(false);
  const [currentTrain, setCurrentTrain] = useState(null);
  const [currentTransport, setCurrentTransport] = useState(null);
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
          setCurrentTransport(vehicleInfo['type'])
          // 1. Track the progress of vehicles along their routes.
          // 2. Display up-to-date information about upcoming stops.
          // 3. React to changes in planned routes or schedules.
          if (feature) {
            const vehicleId = vehicleInfo['train_id']
          trackerLayer.api.subscribeStopSequence(vehicleId, (response) => {
           if (response && response.content && Array.isArray(response.content) && response.content.length > 0) { 
            const [stopSequence] = response.content;
            if (stopSequence) {
              setLineInfos(stopSequence);
            } }
          });
          } else {
            setLineInfos(null);
          }

          // const coordinates = feature.getGeometry().getCoordinates();
        });
      });
      mapRef.current.on('pointermove', (event) => {
        const hit = mapRef.current.hasFeatureAtPixel(event.pixel);
        mapRef.current.getTargetElement().style.cursor = hit ? 'pointer' : '';
      })

      setMapInitialized(true);
    }
  }, []);

  return (
  <ThemeProvider theme={geopsTheme}>
    <div className="map-container" id="map">
    {mapInitialized && (
          <>
    <BasicMap map={mapRef.current} extent={extent} tabIndex={0} className="basic-map" />
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
              <div>{currentTransport}</div>
              <div>
                <RouteSchedule
                  className='rte-progress-and-stops'
                  // renderHeaderButtons={(routeIdentifier) => (
                  //   {/* Should display a filter icon that only shows the actively clicked train & it's route.
                    
                  //   <ToggleButton 
                  //     value="filter"
                  //     selected={filterActive}
                  //     onClick={() => {              
                  //       if (!filterActive) {                
                  //         trackerLayer.filter = (trajectory) => {
                  //           return trajectory.properties.route_identifier === routeIdentifier;
                  //         };
                  //       } else {
                  //         trackerLayer.filter = null;
                  //       }
                  //       setFilterActive(!filterActive);
                  //     }}>
                  //     <FaFilter />              
                  //   </ToggleButton> */}
                  // )}
                  lineInfos={lineInfos}
                  trackerLayer={trackerLayer}
                />
              </div>
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
        </>
    )}
    </div>
  </ThemeProvider>
);
};

export default LiveMap;