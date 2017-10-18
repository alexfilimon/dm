// settings.js
// table.js
// nodes.js
// edges.js
// view.js

var algoritm = {
    start: function() {
        //закрываем таблицу
        objView.hideTable();

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
        //формируем массив left = []; содержит точки с param -1
        var left = [];
        objNodes.nodes.forEach(function(item, i) {
            if (item.param === -1) {
                left.push(i);
            }
        });
        //формируем массив edgesGood = [];
        var edgesGood = objEdges.createEdgesGood(processed, left);
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
            edgesGood = objEdges.createEdgesGood(processed, left);
        }
        //---------------------

        //условие вхождения в рекурсию if () step(parametr+1);
        if (left.length > 0) {
            this.step(param + 1);
        }

    },
    clear: function() { //при нажатии на кнопку очистить
        //удаляем точки с карты и из массива
        objView.deleteNodesFromMap();
        objNodes.nodes = [];
        //очищаем массив булеаном
        table.massBool = [];
        //начинаем алгоритм заново
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
        center: {
            lat: settings.mapCenter.lat,
            lng: settings.mapCenter.lng
        },
        zoom: settings.mapZoom,
        //кастомный стиль
        styles: settings.mapStyle,
        //удаление лишних кнопок на карте
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false
    });

//инициализация поля "поиск"
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

        //скрываем таблицу и добавляем в нее строку и столбец с булианами(связи с другими точками)
        objView.hideTable();
        table.addNode();

        //при клике на маркер
        google.maps.event.addListener(marker, "click", function(e) { //при нажатии на маркер
            //ищем id маркера, на который нажали
            var id = objNodes.getId(marker);
            //показываем таблицу с текущим id
            table.showRow(id);
        });

        //перемещение маркера
        google.maps.event.addListener(marker, "drag", function(e) {
            objView.deleteEdgesFromMap();
            objView.drawEdges();
        });
        google.maps.event.addListener(marker, "dragend", function(e) {
            algoritm.start();
        });
    });

//точка входа
    $(".button-build").click(function(){
        if (objNodes.nodes.length < 2) alert("Недостаточно точек");
        else algoritm.start();
    });

//кнопки
    //очистить карту от точек
    $(".button-delete-nodes").click(function(){
        algoritm.clear();
    });
    //закрыть таблицу
    $(".table-outer .close").click(function() {
        objView.hideTable();
    });
    //закрыть popup
    $(".popup .close").click(function() {
        objView.hidePopup();
    });
    $(".back").click(function() {
        objView.hidePopup();
    });
    $(".button-info").click(function() {
        objView.showPopupInfo();
    })

//высота таблицы
    function heightTable() {
        hBrowser = $(window).height();
        h = hBrowser - 260;
        $(".table-inner .table-content").css("max-height", h + "px");
    };
    heightTable();
//высота popup окна
    function topPopup() {
        var hBrowser = $(window).height();
        var hPopup = $(".popup-info").height();
        console.log(hBrowser, hPopup);
        $(".popup").css("top", ( (hBrowser - hPopup)/2 ) + "px");
    };
    topPopup();
    $(window).resize(function () {
        heightTable();
        topPopup();
    });