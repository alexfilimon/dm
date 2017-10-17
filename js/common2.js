// table.js - this is bool table
// nodes.js
// edges.js
// view.js

var settings = {
    markersColors: [
        { //якорная
            fillColor: "ffffff",
            textColor: "000000",
            outlineColor: "000000"
        },
        { //первая
            fillColor: "cccccc",
            textColor: "000000",
            outlineColor: "000000"
        },
        { //вторая
            fillColor: "ff0000",
            textColor: "000000",
            outlineColor: "000000"
        },
        { //третья
            fillColor: "00ff00",
            textColor: "000000",
            outlineColor: "000000"
        },
        { //четвертая
            fillColor: "0000ff",
            textColor: "ffffff",
            outlineColor: "000000"
        }
    ],
    polyLineWeight: 2,
    polyLineColor: "#FF0000",
    polylineOpacity: 1.0,
    colorShortestPath: "00FF00",

    mapCenter: {
        lat: 51.685959,
        lng: 39.183597
    },
    mapZoom: 12
};

var algoritm = {
    start: function() {
        //сбрасываем нарисованные линии
        objView.deleteEdgesFromMap();

        //обнуляем массив ребер
        objEdges.edges = [];

        //сбрасываем точки
        objNodes.reset();

        //readFromTable
        table.readFromTable();

        //sortAllEdges
        objEdges.sort();

        //шаги алгоритма
        this.step(0);

        //рисуем
        objView.drawEdges();

    },
    step: function(param) {
        //прекращение рекурсии
        if (param > 3) {
            console.log("Прекращение рекурсии по причине длинных путей");
            return true;
        }

        //формируем массив processed = []; содержит точки с param=parametr
        var processed = [];
        objNodes.nodes.forEach(function(item, i) {
            if (item.param === param) {
                processed.push(i);
            }
        });
        console.log("processed: ", processed);

        //формируем массив left = []; содержит точки с param -1
        var left = [];
        objNodes.nodes.forEach(function(item, i) {
            if (item.param === -1) {
                left.push(i);
            }
        });
        console.log("left: ", left);

        //формируем массив edgesGood = [];
        var edgesGood = objEdges.updateEdgesGood(processed, left);
        console.log("edgesGood: ", edgesGood);

        if (edgesGood.length === 0) console.log("edgesGood пуст");


        //---------------------
        while(edgesGood.length > 0 && processed.length > 0) {
            var curEdge = edgesGood[0];
            var node1 = curEdge.node1; //точка из processed массива
            var node2 = curEdge.node2; //точка из left массива

            if (objNodes.nodes[node1].param < objNodes.nodes[node2].param) {
                var tmp = node1;
                node1 = node2;
                node2 = tmp;
            }

            //делаем данное ребро финальным(построенным)
            objEdges.final(curEdge);

            //удаляем ребро curEdge из edgesGood
            objEdges.deleteEdgeFromCustomArr(curEdge, edgesGood);

            //добавляем +1 к count точкам и делаем param точки(из массива left) раный переданному в шаг param + 1
            objNodes.nodes[node1].count++;
            objNodes.nodes[node2].count++;
            objNodes.nodes[node2].param = param + 1;

            //удаляем точку из left массива
            objNodes.deleteNodeFromCustomArr(node2, left);
            //если это первая точка имеет count ==3, то удаляем ее из processed массива
            if (objNodes.nodes[node1].count === 3) objNodes.deleteNodeFromCustomArr(node1, processed);

            //обновляем массив edgesGood
            edgesGood = objEdges.updateEdgesGood(processed, left);
        }
        //---------------------

        //условие вхождения в рекурсию if () step(parametr+1);
        if (left.length > 0) {
            this.step(param + 1);
        }

    },
    clear: function() {
        objView.deleteNodesFromMap();
        objNodes.nodes = [];
        table.massBool = [];
        this.start();
    }
};

function getIcon(id, param) {
    //входные параметры не пропущены ли
    param = param > 0 ? param : 0;

    var text = id > 0 ? id : '•';

    //text = text || '•';
    //if (!text) text = '•'; //generic map dot

    var iconUrl = "http://chart.googleapis.com/chart?cht=d&chdp=mapsapi&chl=pin%27i\\%27[" + text + "%27-2%27f\\hv%27a\\]h\\]o\\" + settings.markersColors[param].fillColor + "%27fC\\" + settings.markersColors[param].textColor + "%27tC\\" + settings.markersColors[param].outlineColor + "%27eC\\Lauto%27f\\&ext=.png";

    return iconUrl;
}

//инициализация карты
    var map = document.getElementById('map'); //создание карты
    map = new google.maps.Map(map, {
        center: {lat: settings.mapCenter.lat, lng: settings.mapCenter.lng},
        zoom: settings.mapZoom
    });

//инициализация поля "поиск"
//поле поиска
    var input = document.getElementById('searchTextField');
    var options = {
        types: ['(regions)'],
    };
    var autocomplete = new google.maps.places.Autocomplete(input, options);
    //при изменении места в поиске изменить центр карты
    google.maps.event.addListener(autocomplete, 'place_changed', function() {
        var place = autocomplete.getPlace(); //получаем место
        self.map.panTo(place.geometry.location); //перемещение камеры к объекту
    });

//listeners
    //map.click
    google.maps.event.addListener(map, 'click', function(e) { //при нажатии на любую точку карты
        var location = e.latLng;
        var marker = new google.maps.Marker({ //создается маркер
            position: location,
            map: map,
            draggable: true,
            icon: getIcon(objNodes.nodes.length, 0),
            animation: google.maps.Animation.DROP
        });


        objNodes.add(location.lat(), location.lng(), marker);

        /*if (!wasFirst) {
            addNodeToAllNodes(location.lat(),location.lng(),0); //добавление точки в внутренний массив
            wasFirst = true;
        }
        else addNodeToAllNodes(location.lat(),location.lng(),-1);*/

        table.addNode();

        //markers.push(marker);

        ////table.showRow(markers.length-1);

        google.maps.event.addListener(marker, "click", function(e) { //при нажатии на маркер
            /*var infoWindow = new google.maps.InfoWindow({
                content: 'x: ' + location.lat() + '<br />y: ' + location.lng()
            });
            infoWindow.open(map, marker);*/
            var lat = e.latLng.lat();
            var lng = e.latLng.lng();

            var id = objNodes.getId(lat, lng);


            //ПЕРЕДЕЛАТЬ

            //показать панель связи точки с другими точками и кнопку удалить точку

            /*$(".side-panel").removeClass("open");
            setTimeout(function() {
                table.showRow(id);

                setTimeout(function() {

                    $(".side-panel").addClass("open");

                }, 500);

            }, 500);*/

            //----------------------
            //вместо инфоокна лучше сделать кнопку на панели связи этой точки с другими
            //----------------------
            /*var infoWindow = new google.maps.InfoWindow({
                content: "<button class='btn btn-delete' onclick='clickDeleteMarker(this)' lat='" + curLat + "' lng='" + curLng + "'>Удалить</button>"
            });

            infoWindow.open(map, marker);*/
        });

        //перемещение маркера
        google.maps.event.addListener(marker, "dragstart", function(e) {
            //var curMarker = marker.getPosition();
            //tmpArrayForMarkerDrag[0] = {lat: curMarker.lat(), lng: curMarker.lng()};
        });
        google.maps.event.addListener(marker, "drag", function(e) {
            //var temp = marker.getPosition();
            //tmpArrayForMarkerDrag[1] = {lat: temp.lat(), lng: temp.lng()};

            objView.deleteEdgesFromMap();

            //editNode(nodeTemp[0].lat,nodeTemp[0].lng,nodeTemp[1].lat,nodeTemp[1].lng);


            objView.drawEdges();

            //tmpArrayForMarkerDrag[0] = tmpArrayForMarkerDrag[1];
        });
        google.maps.event.addListener(marker, "dragend", function(e) {
            //alert("Выполнение программы приостановилось...");
            algoritm.start();
            //console.log(edges);
        });
    });

//точка входа
$(".button-build").click(function(){
    if (objNodes.nodes.length < 2) alert("Недостаточно точек");
    else algoritm.start();
});
$(".button-delete-nodes").click(function(){
    algoritm.clear();
});