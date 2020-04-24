import React, { useEffect } from "react";
import { features } from "./neighborhoods";
import MapUtils from "./map-utils";
import "./App.css";
import Modal from "@material-ui/core/Modal";
import ConfigurePrediction from "./Modals/ConfigurePrediction";
import SanFranciscoAPI from "./utils/SanFranciscoAPI";

function App() {
  const [open, setOpen] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);
  const [neighborhoods, setNeighborhoods] = React.useState([]);
  const [neighborhood, setNeighborhood] = React.useState("");
  const [classifications, setClassifications] = React.useState(null);

  const utils = new MapUtils();

  useEffect(() => {
    Promise.all([
      SanFranciscoAPI().neighborhoods(),
      SanFranciscoAPI().classification(),
    ]).then(([neighborhoods, classifications]) => {
      setNeighborhoods(neighborhoods);
      setClassifications(classifications);
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const { L } = window;

    const featureClickHandler = (e) => {
      // leafletMap.fitBounds(e.target.getBounds());
      const { nhood } = e.target.feature.properties;
      setNeighborhood(nhood);
      setOpen(true);
    };
    const leafletMap = utils.createMap(classifications, featureClickHandler);
  }, [loaded]);

  const handleOpen = (neighborhood) => {
    setNeighborhood(neighborhood);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="App">
      <div id="mapid" />
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={handleClose}
      >
        <ConfigurePrediction neighborhood={neighborhood} />
      </Modal>
    </div>
  );
}

export default App;
