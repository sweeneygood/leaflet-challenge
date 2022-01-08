
function createMap(earthquakeSites) {

// For this project, this is the dataset used: 
// https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson

// creating the tile layer
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
});

var baseMaps = {
    "Light Map": lightmap
};



var overlayMaps = {
    "Earthquakes": earthquakeSites
  };

// Creating map object
var myMap = L.map("map", {
    center: [40.7128, -74.0059],
    zoom: 3,
    layers: [lightmap, earthquakeSites]
});

  // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
  legend.addTo(myMap)

}

function createMarkers(response) {

  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<h2> Magnitude: " + feature.properties.mag + "</h2>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  function createCircleMarker(feature,latlng){
    let options = {
        radius:feature.properties.mag*4,
        fillColor: getColor(feature.properties.mag),
        color: getColor(feature.properties.mag),
        weight: 1,
        opacity: .8,
        fillOpacity: 0.8
    }
    return L.circleMarker(latlng, options);
}
  
  var earthquakes = L.geoJSON(response, {
    onEachFeature: onEachFeature,
    pointToLayer: createCircleMarker
  });
 

    createMap(earthquakes);
}

// Function that returns the color based on the magnitude of the earthquake 

function getColor(mag) {
  // console.log(mag)
  switch(true) {
      case (0.0 <= mag && mag < 4.0):
        return "#0000FF";
      case (4.0 <= mag && mag < 5.0):
        return "#FFFF00";
      case (5.0 <= mag && mag < 5.5):
        return "#FF7F00";
      case (5.5 <= mag && mag <= 15.0):
        return "#FF0000";
      default:
        return "#4B0082";
  }
}

// used this code example: https://leafletjs.com/examples/choropleth/
var legend = L.control({position: 'bottomleft'});

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [4.0, 5.0, 5.5],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i]) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
};

// Use this link to get the geojson data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson").then(createMarkers);

