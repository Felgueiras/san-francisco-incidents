import React, { useEffect } from "react";
import neighborhoods from "./neighborhoods";
import MapUtils from "./map-utils";
import "./App.css";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import Ch from "./Modal/Ch";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  };
}

function App() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [neighborhood, setNeighborhood] = React.useState("");
  const [modalStyle] = React.useState(getModalStyle);

  const utils = new MapUtils();
  const style = feature => {
    return {
      fillColor: utils.getColor(feature.properties.density),
      weight: 2,
      opacity: 1,
      color: "white",
      dashArray: "3",
      fillOpacity: 0.7
    };
  };

  useEffect(() => {
    const { L } = window;
    let geoJSON;
    const leafletMap = utils.createMap();
    const legend = L.control({ position: "bottomright" });
    const info = L.control();

    const highlightFeature = e => {
      var layer = e.target;

      layer.setStyle({
        weight: 5,
        color: "#666",
        dashArray: "",
        fillOpacity: 0.7
      });

      if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
      }

      info.update(layer.feature.properties);
    };

    const resetHighlight = e => {
      geoJSON.resetStyle(e.target);
      info.update();
    };

    const zoomToFeature = e => {
      // leafletMap.fitBounds(e.target.getBounds());
      const { nhood } = e.target.feature.properties;
      handleOpen(nhood);
    };

    function onEachFeature(feature, layer) {
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
      });
    }

    geoJSON = L.geoJson(neighborhoods, {
      style,
      onEachFeature
    }).addTo(leafletMap);

    info.onAdd = function(map) {
      this._div = L.DomUtil.create("div", "info"); // create a div with a class "info"
      this.update();
      return this._div;
    };

    // method that we will use to update the control based on feature properties passed
    info.update = function(props) {
      this._div.innerHTML =
        "<h4>Crime rate</h4>" +
        (props
          ? "<b>" + props.nhood + "</b><br />" + 100 + " crimes / 1k people"
          : "Hover over a neighborhood");
    };

    info.addTo(leafletMap);

    legend.onAdd = function(map) {
      const div = L.DomUtil.create("div", "info legend"),
        grades = [0, 10, 20, 50, 100, 200, 500, 1000];

      // loop through our density intervals and generate a label with a colored square for each interval
      for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
          '<i style="background:' +
          utils.getColor(grades[i] + 1) +
          '"></i> ' +
          grades[i] +
          (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
      }

      return div;
    };

    legend.addTo(leafletMap);
  }, []);

  const handleOpen = neighborhood => {
    setNeighborhood(neighborhood);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="App">
      <div id="mapid"></div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={handleClose}
      >
        <div style={modalStyle} className={classes.paper}>
          <h2 id="simple-modal-title">
            Predicted incidents for tomorrow in {neighborhood}
          </h2>
          <Ch neighborhood={neighborhood} />
        </div>
      </Modal>
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  }
}));

export default App;
