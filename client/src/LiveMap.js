import React from 'react';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Map from 'ol/Map';
import View from 'ol/View';
import { geopsTheme } from '@geops/geops-ui';
import { ThemeProvider } from '@mui/material';
import Button from '@mui/material/Button';
import FitExtent from 'react-spatial/components/FitExtent';
import BasicMap from 'react-spatial/components/BasicMap';
import Geolocation from 'react-spatial/components/Geolocation';
import 'ol/ol.css';

// const extent = [-13884991, 2870341, -7455066, 6338219]; for USA
// const extent = [-8100000, 4950000, -7900000, 5300000] // for MA
const extent = [-7930000, 5190000, -7890000, 5230000] // for Boston, MA

const map = new Map({
  view: new View({
    center: [-7910000, 5210000],
    zoom: 4,
  }),
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
  ],
  controls: [],
});

const LiveMap = () => (
  <ThemeProvider theme={geopsTheme}>
    <div className="map-container">
    <BasicMap map={map} tabIndex={0} className="basic-map" />
    <Geolocation map={map} />
    <FitExtent map={map} extent={extent}>
      <Button>
        Fit to Boston
      </Button>
    </FitExtent>
    </div>
  </ThemeProvider>
);

export default LiveMap;