import React, { useEffect } from "react";
import MapUtils from "./map-utils";
import "./App.css";
import SetupPrediction from "./Modals/SetupPrediction";
import SanFranciscoAPI from "./utils/SanFranciscoAPI";
import CircularProgress from "@material-ui/core/CircularProgress";

function App() {
  const [loaded, setLoaded] = React.useState(false);
  const [neighborhoods, setNeighborhoods] = React.useState([]);
  const [predictions, setPredictions] = React.useState(null);

  const utils = new MapUtils();

  useEffect(() => {
    Promise.all([
      SanFranciscoAPI().neighborhoods(),
      SanFranciscoAPI().predictions(),
    ]).then(([neighborhoods, predictions]) => {
      setNeighborhoods(neighborhoods);
      // each prediction has {classification, regression}
      setPredictions(predictions);
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!loaded) return;
    utils.createMap(neighborhoods, predictions);
  }, [loaded, predictions]);

  return (
    <div className="App">
      {loaded ? (
        <div>
          <div id="mapid" />
          <SetupPrediction updatePredictions={setPredictions} />
        </div>
      ) : (
        <div className="center">
          <h4>Loading initial prediction data</h4>
          <CircularProgress />
        </div>
      )}
    </div>
  );
}

export default App;
