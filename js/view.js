var objView = {
    drawEdges: function() { //рисует edges(у которых final == true) на карте
        objEdges.edges.forEach(function(item, i) {
            if (item.final) {
                var coordinates = [
                    {
                        lat: objNodes.nodes[item.node1].marker.getPosition().lat(),
                        lng: objNodes.nodes[item.node1].marker.getPosition().lng()
                    },
                    {
                        lat: objNodes.nodes[item.node2].marker.getPosition().lat(),
                        lng: objNodes.nodes[item.node2].marker.getPosition().lng()
                    }
                ];

                //создание объекта GoogleMaps
                var flightPath = new google.maps.Polyline({
                    path: coordinates,
                    geodesic: true,
                    strokeColor: settings.polyLineColor,
                    strokeOpacity: settings.polylineOpacity,
                    strokeWeight: settings.polyLineWeight
                });
                flightPath.setMap(map);

                //сохранение polyline
                item.polyline = flightPath;

                //разноцветные маркеры
                objNodes.nodes[item.node1].marker.setIcon( getIcon(item.node1, objNodes.nodes[item.node1].param ) );
                objNodes.nodes[item.node2].marker.setIcon( getIcon(item.node2, objNodes.nodes[item.node2].param ) );
            }
        });
    },
    deleteEdgesFromMap: function() { //убирает все линии с карты
        objEdges.edges.forEach(function(item) {
            if (item.polyline) {
                item.polyline.setMap(null);
                item.polyline = null;
            }
        });
    },
    deleteNodesFromMap: function(id) { //удаляет все точки с карты
        objNodes.nodes.forEach(function(item) {
            item.marker.setMap(null);
            item.marker = null;
        });
    },
    deleteNodeFromMap: function(id) { //удаляет определенную точку с карты по ее id
        objNodes.nodes[id].marker.setMap(null);
        objNodes.nodes[id].marker = null;
    },
    hideTable: function() { //скрыть таблицу
        $(".side-panel").removeClass("open");
    },
    showTable: function() { //показать таблицу
        $(".side-panel").addClass("open");
    },
    hidePopup: function() {
        $(".back").fadeOut();
        $(".popup").fadeOut();
    },
    showPopupInfo: function () {
        $(".back").fadeIn();
        $(".popup-info").fadeIn();
    }
};