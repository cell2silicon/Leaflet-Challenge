// Data visualisation with leaftlet and mapbox

// Creating URL variables for Earthquakes and Tectonic Plates 
var earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var tectonicUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"


// Perform a GET request to the query Earthquake URL
d3.json(earthquakeUrl).then(function(earthData) {
  // console.log(earthData);
});

// Perform a GET request to the query Tectonic Plate URL
d3.json(tectonicUrl).then(function(plateData){
  // console.log(plateData);
  // Add techtonic plate data to map
  L.geoJSON(plateData, {
    color: "#7fc97f",
    weight: 3
  })
  .addTo(tectonicPlate)
  tectonicPlate.addTo(myMap)
});


  // Define streetmap, darkmap and satellite map layers
  var streetMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var darkMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  var satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    id: 'mapbox/satellite-v9',
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
});

// Create two separate layer groups: one for cities and one for states
  var earthquake = L.layerGroup(earthquake);
  var tectonicPlate = L.layerGroup(tectonicPlate);


  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetMap,
    "Dark Map": darkMap,
    "Satellite Map": satelliteMap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    "Earthquake": earthquake,
    "Tectonic Plates": tectonicPlate
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [satelliteMap, streetMap, darkMap]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

// Getting data from Earthquake URL to get magnitude
d3.json(earthquakeUrl).then(function(earthData) {
  // console.log(earthData)
  function magSize(magnitude) {
    return magnitude * 3; 
  }

  // Function to set style for marker
  function styleInfo(features) {
    return {
      opacity: 0.9,
      fillOpacity: 0.9,
      fillColor: chooseColor(features.geometry.coordinates[2]),
      color: "#f0f9e8",
      radius: magSize(features.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }  
  // Function for color of marker
  function chooseColor(depth) {
      if (depth > 90)
            return "#b30000";
        else if (depth > 70)
            return "#e34a33";
        else if (depth > 50)
            return "#fc8d59";
        else if (depth > 30)
            return "#fdbb84";
        else if (depth > 10)
            return "#fdd49e";
        else
            return "#fef0d9";
    }

  // Create GeoJSON layer for earthquake data
  L.geoJSON(earthData, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
      
    },
    style: styleInfo,

    // Popup describing the place and time of Earthquake
    onEachFeature: function(features, layer) {
      layer.bindPopup(
        "Location: "
        + features.properties.place
        + "<br> Depth: "
        + features.geometry.coordinates[2]
        + "<br> Magnitude: "
        + features.properties.mag
        + "<br> Time: "
        + Date(features.properties.time)
      );
    }
  }).addTo(earthquake)
  earthquake.addTo(myMap)
});
