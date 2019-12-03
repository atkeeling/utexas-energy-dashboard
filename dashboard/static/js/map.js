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

// testjson = d3.json("/building_json")
// console.log(testjson)


d3.json("/building_json").then(allBuildings => {
    allBuildings.forEach(building => {
        L.marker([building.lat,building.lon])
        .bindPopup(`<a href='plots/${building.acr}'>${building.acr}</a>`)
        .addTo(mymap)
    })
})


// d3.json("/building_json", function(data) {
//     console.log(data)
//     Object.entries(data).forEach(building => {
//         L.marker([building.lat,building.lon])
//         .bindPopup(`<a href='plots/${building.acr}'>${building.acr}</a>`)
//         .addTo(mymap)
//     })
// })

// d3.csv("data/lat_lon.csv", function(data) {
//         console.log(data)
//         data.forEach(building => {
//             L.marker([building.Latitude,building.Longitude])
//             .bindPopup(`<a href='plots/${building.Building}'>${building.Building}</a>`)
//             .addTo(mymap)
//         })
//     })

// let buildingLayer = new L.LayerGroup();

// let baseLayers = {
//     "Outdoors": outdoors,
// };

// L.control.layers(baseLayers, {collapsed: false}).addTo(mymap);
 
