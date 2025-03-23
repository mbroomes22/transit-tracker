import React, { useRef, useEffect, useState } from 'react';
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
import { Style, Fill, Stroke, Icon, Text, Circle as CircleStyle } from 'ol/style';
// import CircleStyle from 'ol/style/Circle';


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
  const [extent, setExtent] = useState([-7930000, 5195000, -7895000, 5228000]); // Approximate extent for downtown Boston, MA
  const [lineInfos, setLineInfos] = useState(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [filterActive, setFilterActive] = useState(false);
  const [open, setOpen] = useState(false);
  const [currentTransport, setCurrentTransport] = useState(null);
  const [stopsLayer, setStopsLayer] = useState(null);
  const [routeLayer, setRouteLayer] = useState(null);
  const [openVectorLayers, setOpenVectorLayers] = useState([]);
  const [openRouteLayers, setOpenRouteLayers] = useState([]);
  // const [popupContent, setPopupContent] = useState('');
  // const [popupPosition, setPopupPosition] = useState(null);
  const [updateLayers, setUpdateLayers] = useState(false);
  const [closeAllLayers, setCloseAllLayers] = useState(false);
  const mapRef = useRef(null);

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
            // const stopName = feature['values_']['name'];
            // console.log('stopName name:', stopName);
            // setPopupContent(stopName);
            // console.log('event.coordinate:', event.coordinate);
            // const pixel = mapRef.current.getPixelFromCoordinate(event.coordinate)
            // setPopupPosition(event.coordinate);
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
  }, []);

  // Remove higlighted routes & stops when updateLayers is true
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

  // Display stops on map
  const displayStopsOnMap = (stops, color) => {
    if (stopsLayer) {
      mapRef.current.removeLayer(stopsLayer);
      stopsLayer.getSource().clear();
    }

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

    mapRef.current.addLayer(vectorLayer);
    setStopsLayer(vectorLayer);

    setOpenVectorLayers((prevLayers) => [...prevLayers, vectorLayer]);
  };

// Highlights vehicle route on map
  const highlightRoute = (route, color) => {
    if (!route || !Array.isArray(route) || route.length === 0) {
      console.error('Invalid route:', route);
      return;
    }
    if (routeLayer) {
      mapRef.current.removeLayer(routeLayer);
    }

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

    mapRef.current.addLayer(newRouteLayer);
    setRouteLayer(newRouteLayer);

    setOpenRouteLayers((prevLayers) => [...prevLayers, newRouteLayer]);
    setUpdateLayers(true);
  }

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
    {/* {popupContent && popupPosition && (
      <div className='custom-popup' style={{left: `${popupPosition[0]}px`, top: `${popupPosition[1]}px`}}>
        {popupContent}
      </div>
    )} */}
        </>
    )}
    </div>
  </ThemeProvider>
);
};

export default LiveMap;