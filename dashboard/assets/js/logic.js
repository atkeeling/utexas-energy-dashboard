// d3.json(earthquake_url, function (data){
//     L.geoJson(data.features, {
//         pointToLayer: function (feature, latlng) {
//             return L.circleMarker (latlng, {radius: 4*feature.properties.mag});
//         },
//         style: function (feature) {
//             return {
//                 fillColor: Color(feature.properties.mag),
//                 fillOpacity: 0.6,
//                 weight: 0
//             }
//         },
//         onEachFeature: function (feature,layer) {
//             layer.bindPopup(
//                 "<h3 style='text-align:center;'>" + feature.properties.title +
//                 "</h3> <hr> <h3 style='text-align:center;'>" + new Date(feature.properties.time) + "</h3>");
//         }
//     }).addTo(earthquakeLayer);
// });

// let faultlineLayer = new L.LayerGroup();

// d3.json(plate_url, function (data) {
//     L.geoJSON(data.features, {
//         style: {
//             weight: 3,
//             color: 'blue'
//         }
//     }).addTo(faultlineLayer);
// })

// function Color(magnitude) {
//     if (magnitude > 5) {
//         return "#330000"
//     } else if (magnitude > 4) {
//         return "#990000"
//     } else if (magnitude > 3) {
//         return "#FF0000"
//     } else if (magnitude > 2) {
//         return "#FF6666"
//     } else if (magnitude > 1) {
//         return "#FFB3B3"
//     } else {
//         return "#FFCCCC"
//     }
// }

let test = new L.LayerGroup();

function createMap() {
    let satellite = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>',
        maxZoom: 10,
        id: 'mapbox.satellite',
        accessToken: API_KEY
    });
    let grayscale = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>',
        maxZoom: 10,
        id: 'mapbox.light',
        accessToken: API_KEY
    });
    let outdoors = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>',
        maxZoom: 10,
        id: 'mapbox.outdoors',
        accessToken: API_KEY
    });
    let dark = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>',
        maxZoom: 10,
        id: 'mapbox.dark',
        accessToken: API_KEY
    });

    let baseLayers = {
        "Satellite": satellite,
        "Grayscale": grayscale,
        "Outdoors": outdoors,
        "Dark": dark       
    };

    let overlayLayers = {
        "Test": test,
        // "Fault Lines": faultlineLayer,       
    };

    let mymap = L.map('map', {
        center: [30.28, -97.74],
        zoom: 10,
        layers: [outdoors, test] 
        // , earthquakeLayer, faultlineLayer]
    });

    L.control.layers(baseLayers, {collapsed: false}).addTo(mymap);
    // overlayLayers, 
 
    // let legend = L.control({position: 'bottomright'});

    // legend.onAdd = function () {

    //     let div = L.DomUtil.create('div', 'info legend'),
    //         magnitude = [0, 1, 2, 3, 4, 5];

    //     div.innerHTML += "<h4 style='margin:4px'>Magnitude</h4>"

    //     for (let i = 0; i < magnitude.length; i++) {
    //         div.innerHTML += '<i style="background:' + Color(magnitude[i] + 1) + '"></i> ' +
    //         magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
    //     }
    //     return div;
    // };
    // legend.addTo(mymap);
}

createMap();

let mapmargin = 50;
$('#map').css("height", ($(window).height() - mapmargin));
$(window).on("resize", resize);
resize();
function resize(){

    if($(window).width()>=980){
        $('#map').css("height", ($(window).height() - mapmargin));    
        $('#map').css("margin-top",50);
    }else{
        $('#map').css("height", ($(window).height() - (mapmargin+12)));    
        $('#map').css("margin-top",-21);
    }

}