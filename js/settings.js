var settings = {
    //кастройки цветов маркеров и путей
    markersColors: [
        { //якорная
            fillColor: "f3f3f3",
            textColor: "000000",
            outlineColor: "626262"
        },
        { //первая
            fillColor: "ec1c4b",
            textColor: "ffffff",
            outlineColor: "626262"
        },
        { //вторая
            fillColor: "ffd803",
            textColor: "000000",
            outlineColor: "626262"
        },
        { //третья
            fillColor: "a2d4ab",
            textColor: "000000",
            outlineColor: "626262"
        },
        { //четвертая
            fillColor: "f6903d",
            textColor: "000000",
            outlineColor: "626262"
        }
    ],
    mapStyle: [
        {
            "featureType": "landscape.man_made",
            "elementType": "all",
            "stylers": [
                {
                    "color": "#faf5ed"
                },
                {
                    "lightness": "0"
                },
                {
                    "gamma": "1"
                }
            ]
        },
        {
            "featureType": "landscape.man_made",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "gamma": "1.00"
                }
            ]
        },
        {
            "featureType": "landscape.natural",
            "elementType": "geometry",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "hue": "#20ff00"
                },
                {
                    "gamma": "1.00"
                }
            ]
        },
        {
            "featureType": "landscape.natural",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "hue": "#63ff00"
                }
            ]
        },
        {
            "featureType": "landscape.natural.terrain",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#bae5a6"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "all",
            "stylers": [
                {
                    "weight": "1.00"
                },
                {
                    "gamma": "1.8"
                },
                {
                    "saturation": "0"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "hue": "#ffb200"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "lightness": "0"
                },
                {
                    "gamma": "1"
                }
            ]
        },
        {
            "featureType": "transit.station.airport",
            "elementType": "all",
            "stylers": [
                {
                    "hue": "#b000ff"
                },
                {
                    "saturation": "23"
                },
                {
                    "lightness": "-4"
                },
                {
                    "gamma": "0.80"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "all",
            "stylers": [
                {
                    "color": "#a0daf2"
                }
            ]
        }
    ],
    polyLineWeight: 2,
    polyLineColor: "#FF0000",
    polylineOpacity: 1.0,
    colorShortestPath: "00FF00",

    //настройки карты
    mapCenter: {
        lat: 51.685959,
        lng: 39.183597
    },
    mapZoom: 12,

    //глобальные настройки программы
    hardAlgoritm: false
};