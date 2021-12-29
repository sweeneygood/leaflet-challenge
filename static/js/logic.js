
function createMap(earthquakeSites) {

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

}

function createMarkers(response) {

    // Pull the "earthquake" property off of response.data
    var earthquakes = response.features;

    // Initialize an array to hold earthquakes
    var listOfSites = [];

    // Loop through the features array
    for (var index = 0; index < earthquakes.length; index++) {
        var earthquake = earthquakes[index];

        var earthquakelat = earthquake.geometry.coordinates[1];
        var earthquakelon = earthquake.geometry.coordinates[0];
        var earthquakeplace = earthquake.properties.title

        // For each earthquake, create a marker and bind a popup with the earthquake's name
        var oneSite = L.circleMarker([earthquakelat, earthquakelon]).bindPopup("<h3>Info: <br>" + earthquakeplace + "</h3>");
                // pane:  'markers1', 
                // "fillColor": "#012999"};
        // "radius": 5,
        // "fillColor": "#012999",
        // "color": "#012999",
        // "weight": 1,
        // "opacity": 1
        // Add the marker to the listOfSites array
        listOfSites.push(oneSite);
    }

    // Create a layer group made from the array, pass it into the createMap function

    createMap(L.layerGroup(listOfSites));
}

// Use this link to get the geojson data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson").then(createMarkers);

