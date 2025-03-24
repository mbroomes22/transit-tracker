import React, { useRef, useEffect, useState, useCallback } from 'react';
import TileLayer from 'ol/layer/Tile';
import { RealtimeLayer as TrackerLayer } from 'mobility-toolbox-js/ol';
import OSM from 'ol/source/OSM';
import Map from 'ol/Map';
import View from 'ol/View';
import Overlay from 'react-spatial/components/Overlay';
import { geopsTheme } from '@geops/geops-ui';
import { ThemeProvider, ToggleButton } from '@mui/material';
import { FaFilter } from 'react-icons/fa';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import FitExtent from 'react-spatial/components/FitExtent';
import BasicMap from 'react-spatial/components/BasicMap';
import Geolocation from 'react-spatial/components/Geolocation';
import RouteSchedule from 'react-spatial/components/RouteSchedule';
import Zoom from 'react-spatial/components/Zoom';
import 'ol/ol.css';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import LineString from 'ol/geom/LineString';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Style, Fill, Stroke, Circle as CircleStyle } from 'ol/style';

console.log("process.env.REACT_APP_GEOPS_API_KEY:", process.env.REACT_APP_GEOPS_API_KEY);



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
  const extent = [-7930000, 5195000, -7895000, 5228000]; // Approximate extent for downtown Boston, MA
  const [lineInfos, setLineInfos] = useState(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [filterActive, setFilterActive] = useState(false);
  const [open, setOpen] = useState(false);
  const [currentTransport, setCurrentTransport] = useState(null);
  const [openVectorLayers, setOpenVectorLayers] = useState([]);
  const [openRouteLayers, setOpenRouteLayers] = useState([]);
  const [popupContent, setPopupContent] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [updateLayers, setUpdateLayers] = useState(false);
  const [closeAllLayers, setCloseAllLayers] = useState(false);
  const mapRef = useRef(null);


  // Display stops on map
  const displayStopsOnMap = useCallback((stops, color) => {

    // find all stops and create a feature w/styling for each
     const features = stops.map((stop) => {
      const feature = new Feature({
        geometry: new Point(stop['coordinate']),
        name: stop['stationName'],
      });
      feature.setStyle(
        new Style({
          image: new CircleStyle({
            radius: 5,
            fill: new Fill({
              color: `${color || 'blue'}`
            })
          }),
        })
      );
        return feature;
    });

    const vectorSource = new VectorSource({
      features: features,
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    // add the vector layer of stops to the map
    mapRef.current.addLayer(vectorLayer);
    // add the stops vector layer to the array so we can find & remove it later
    setOpenVectorLayers((prevLayers) => [...prevLayers, vectorLayer]);
  }, []);


  // Highlights vehicle route on map
  const highlightRoute = useCallback((route, color) => {
    // ensure route is valid. it should be an array of coordinates.
    if (!route || !Array.isArray(route) || route.length === 0) {
      console.error('Invalid route:', route);
      return;
    }

    // create a feature with a styled line through the route
    const routeFeature = new Feature({
      geometry: new LineString(route),
    });
    routeFeature.setStyle(
      new Style({
        stroke: new Stroke({
          color: `${color || 'blue'}`,
          width: 3,
        }),
      })
    );

    const routeSource = new VectorSource({
      features: [routeFeature],
    });

    const newRouteLayer = new VectorLayer({
      source: routeSource,
    });

    // add the vector layer of routes to the map
    mapRef.current.addLayer(newRouteLayer);
    // add the route vector layer to the array so we can find & remove it later
    setOpenRouteLayers((prevLayers) => [...prevLayers, newRouteLayer]);
    // update the map layers to remove all previously shown routes & stops
    setUpdateLayers(true);
  }, []);


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
        // opens the overlay with vehicle info
          setOpen(true);
          // setUpdateLayers(true);
        mapRef.current.forEachFeatureAtPixel(event.pixel, (feature) => {
          if (feature) {
          const vehicleInfo = feature.getProperties(); 
          
          // 1. Track the progress of vehicles along their routes.
          // 2. Display up-to-date information about upcoming stops.
          // 3. React to changes in planned routes or schedules.
          if (vehicleInfo['train_id']) {
            // handle vehicle clicks
            setCurrentTransport(vehicleInfo['type'])
            const vehicleId = vehicleInfo['train_id']
            trackerLayer.api.subscribeStopSequence(vehicleId, (response) => {
              if (response && response.content && Array.isArray(response.content) && response.content.length > 0) { 
                const [stopSequence] = response.content;
                if (stopSequence) {
                  setLineInfos(stopSequence);
                  const mapStops = stopSequence['stations']
                  const route = stopSequence['stations'].map((stop) => stop['coordinate']);
                  const color = stopSequence['color'];
                  displayStopsOnMap(mapStops, color);
                  highlightRoute(route, color);
                }
              }
            });
          } 
          else {
          // handle stop clicks
            const stopName = feature['values_']['name'];
            setPopupContent(stopName);
            const coordinates = event.coordinate;
            const pixel = mapRef.current.getPixelFromCoordinate(coordinates);
            const mapContainer = document.getElementById('map');
            const virtualAnchor = document.createElement('div');
            virtualAnchor.style.position = 'absolute';
            virtualAnchor.style.left = `${pixel[0]}px`;
            virtualAnchor.style.top = `${pixel[1]}px`;
            mapContainer.appendChild(virtualAnchor);
            setAnchorEl(virtualAnchor);
          }
        } else {
          setLineInfos(null);
        }
        });
      });
      // Change mouse cursor when hovering over a feature
      mapRef.current.on('pointermove', (event) => {
        const hit = mapRef.current.hasFeatureAtPixel(event.pixel);
        mapRef.current.getTargetElement().style.cursor = hit ? 'pointer' : '';
      })

      setMapInitialized(true);
    }
  }, [displayStopsOnMap, highlightRoute]);


  // Remove all highlighted routes & stops except for the most recently clicked vehicle when updateLayers is true.
  // Remove all layers when closeAllLayers is true.
  useEffect(() => {
    if (updateLayers) {
      if (openRouteLayers.length > 1) {
        // remove each open layer from the map.
        // remove each open layer from the openRouteLayers array.
        const removalLayers = openRouteLayers.splice(0, openRouteLayers.length - 1);
        removalLayers.forEach((layer) => mapRef.current.removeLayer(layer));
      }
      if (openVectorLayers.length > 1) {
        const removalLayers = openVectorLayers.splice(0, openVectorLayers.length - 1);
        removalLayers.forEach((layer) => mapRef.current.removeLayer(layer));
      }
      setUpdateLayers(false);
    } if (closeAllLayers) {
      if (openRouteLayers.length > 0) {
        openRouteLayers.forEach((layer) => mapRef.current.removeLayer(layer));
        setOpenRouteLayers([]);
      }
      if (openVectorLayers.length > 0) {
        openVectorLayers.forEach((layer) => mapRef.current.removeLayer(layer));
        setOpenVectorLayers([]);
      }
      setCloseAllLayers(false);
    }
  }, [updateLayers, closeAllLayers, openRouteLayers, openVectorLayers]);


  const handlePopoverClose = () => {
    if (anchorEl) {
      anchorEl.remove();
    }
    setAnchorEl(null);
  };

  return (
  <ThemeProvider theme={geopsTheme}>
    <div className="map-container" id="map">
    {mapInitialized && (
        <>
          <BasicMap map={mapRef.current} extent={extent} tabIndex={0} className="basic-map" />
          <Zoom className="zoom"  map={mapRef.current} zoomSlider />
          <Geolocation map={mapRef.current} className="target" />
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
                      setCloseAllLayers(true);
                    }}
                  >
                    x
                  </button>
                  <div className='menu-collapsible-vertical'>
                    <div>{currentTransport}</div>
                    <div>
                      <RouteSchedule
                        className='rte-progress-and-stops'
                        renderHeaderButtons={(routeIdentifier) => (
                          //  displays a filter icon that only shows the actively clicked train & it's route.
                          
                          <ToggleButton 
                            value="filter"
                            selected={filterActive}
                            onClick={() => {              
                              if (!filterActive) {                
                                trackerLayer.filter = (trajectory) => {
                                  return trajectory.properties.route_identifier === routeIdentifier;
                                };
                              } else {
                                trackerLayer.filter = null;
                              }
                              setFilterActive(!filterActive);
                            }}>
                            <FaFilter />              
                          </ToggleButton> 
                        )}
                        lineInfos={lineInfos}
                        trackerLayer={trackerLayer}
                      />
                    </div>
                  </div>
                </div>
              </Overlay>)}
          <FitExtent map={mapRef.current} extent={extent}>
            <Button>
              Fit to Boston
            </Button>
          </FitExtent>
          <Popover 
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={handlePopoverClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            sx={{
              '& .MuiPopover-paper': {
                        backgroundColor: 'white',
                        padding: '10px',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',},
            }}
          > 
            <div className='popup-content'>
              <div>Stop Name:</div>
              <div>{popupContent}</div>
            </div>
          </Popover>
        </>
    )}
    </div>
  </ThemeProvider>
);
};

export default LiveMap;