let outdoors = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>',
    maxZoom: 20,
    id: 'mapbox.outdoors',
    accessToken: API_KEY
});

let mymap = L.map('map', {
    center: [30.2845, -97.733],
    zoom: 16,
    layers: [outdoors] 
});

d3.json("/building_json", function(data) {
    data.forEach(building => {
        L.marker([building.lat,building.lon])
        .bindPopup(`<a href='plots/${building.acr}'>${building.acr}</a>`)
        .addTo(mymap)
    })
})

// let buildingLayer = new L.LayerGroup();

// let baseLayers = {
//     "Outdoors": outdoors,
// };

// L.control.layers(baseLayers, {collapsed: false}).addTo(mymap);
 
