import features from "./utils/features";
import React from "react"
const grades = ["Reduce", "Moderated", "High"];
let map;

class MapUtils {
  createMap = (neighborhoods, predictions, featureClickHandler) => {
    const { L } = window;
    let geoJSON;

    if (map) {
      map.off();
      map.remove();
    }
    map = L.map("mapid", { zoomControl: false }).setView(
      [37.75398, -122.431297],
      13
    );

    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
    map.boxZoom.disable();
    map.keyboard.disable();
    map.dragging.disable();

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: "mapbox/streets-v11",
      tileSize: 512,
      zoomOffset: -1,
      accessToken: "your.mapbox.access.token",
    }).addTo(map);

    // create control panel
    const featureInfo = L.control();

    featureInfo.onAdd = function (map) {
      this._div = L.DomUtil.create("div", "info"); // create a div with a class "info"
      this.update();
      return this._div;
    };

    // method that we will use to update the control based on feature properties passed
    featureInfo.update = function (props) {
      if (!props) return;
      // get neighborhood for props
      const n = neighborhoods.find((n) => n.neighborhood === props.nhood);
      const { regression } = predictions[props.nhood];
      const { mean_age, mean_income, population } = n;
      this._div.innerHTML = `<div>
                    <b>${props.nhood}</b>
                <h4>Population</h4>
                <p>${population}</p>
                <h4>Mean age</h4>
                <p>${mean_age}</p>
                <h4>Mean income</h4>
                <p>${mean_income}</p>
                <h4>Nº of predicted crimes</h4>
                <p>${regression}</p>
                <div>`;
    };

    const highlightFeature = (e) => {
      var layer = e.target;

      layer.setStyle({
        weight: 5,
        color: "#666",
        dashArray: "",
        fillOpacity: 0.7,
      });

      if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
      }

      featureInfo.update(layer.feature.properties);
    };

    const resetHighlight = (e) => {
      geoJSON.resetStyle(e.target);
      featureInfo.update();
    };

    function onEachFeature(feature, layer) {
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: featureClickHandler,
      });
    }

    const featureStyle = (feature) => {
      return {
        fillColor: this.getColor(
          grades.indexOf(predictions[feature.properties.nhood].classification)
        ),
        weight: 2,
        opacity: 1,
        color: "white",
        dashArray: "3",
        fillOpacity: 0.7,
      };
    };

    geoJSON = L.geoJson(features, {
      style: featureStyle,
      onEachFeature,
    }).addTo(map);
    featureInfo.addTo(map);

    // display feature info on the top right corner
    const legend = L.control({ position: "bottomright" });
    legend.onAdd = function (map) {
      const div = L.DomUtil.create("div", "info legend");

      // loop through our density intervals and generate a label with a colored square for each interval
      for (let i = 0; i < grades.length; i++) {
        div.innerHTML += `
<div>
<i style="background:${new MapUtils().getColor(i)}"></i>
<p>
${grades[i]}
</p>
</div>`;
      }

      return div;
    };

    legend.addTo(map);

    const centerPoint = (points) => {

      const reduced = points.reduce((acc, val) => {
        return {
          lat: acc.lat + val[1],
          lng: acc.lng + val[0],
        }
      }, {
        lat: 0,
        lng: 0
      });

      return [reduced.lat / points.length, reduced.lng / points.length]
    };

    features.features.forEach(feature => {

      const { nhood } = feature.properties;
      const { coordinates } = feature.geometry;
      const polygonFeaturesCoordinates = coordinates[0][0]
      const center = centerPoint(polygonFeaturesCoordinates);
      // marker coordinates
      const myIcon = L.divIcon({
        className: 'div-icon',
        html: `<div>${nhood}</div>`
      });
      const marker = L.marker(center, { icon: myIcon });
      // marker.bindTooltip(nhood)
      marker.addTo(map);

    });
    // TODO: add tooltips / divicon

    return map;
  };

  getColor = (index) => {
    let color = "#ffffff";
    if (index === 0) {
      color = "#22ff22";
    } else if (index === 1) {
      color = "#ffff22";
    } else if (index === 2) {
      color = "#ff2222";
    }
    return color;
  };
}

export default MapUtils;
