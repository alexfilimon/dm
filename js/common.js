//глобальные массивы
  var allEdges = []; //все ребра
  var allNodes = []; //все точки
  var finalEdges = []; //финальнон остовное дерево

  var polyLines = []; //нарисованные линии
  var markers = []; //маркеры на карте


  var nodeTemp = []; //временное ребро(для перерисовки при drag)

//глобальные переменные
  var labelIndex = -1; //кол-во точек
  var wasFirst = false; //была ли первая точка

//кнопки
  function height() {
    var h = $(window).height();
    $("#map").css('height',(h-64-28)+'px');
    $(".side-panel").css('height',(h-64)+'px');
  };
  height();
  $(window).resize(height);
  //$(".button-open-side-panel").addClass("open");
  $(".button-menu").click(function() {
    $(".side-panel").toggleClass("open");
  });

//функции
  function getIdMarkerFromAllMarkers(lat, lng) { //поиск id маркера по его координатам
    for(var i=0; i<markers.length; i++) {
      if ( lat == markers[i].position.lat() && lng == markers[i].position.lng() ) {
        return i;
      }
    }
    return -1;
  };
  function addNodeToAllNodes(x, y, param) { //добавить точку в массив всех точек
    var tempObject = {
      x: x,
      y: y,
      par: param,
      count: 0
    };
    allNodes.push(tempObject);
  };
  function editNode(oldx, oldy, newx, newy) { //редактирование точки в массиве всех точек
    for (var i=0; i<allNodes.length; i++) {
      if ( allNodes[i].x == oldx && allNodes[i].y == oldy ){
        allNodes[i].x = newx;
        allNodes[i].y = newy;
        return true;
      }
    }
  };

  function sortAllEdges() { //отсортировать массив всех ребер по возрастанию(сначала маленькие)
    for(var i=0; i<allEdges.length-1; i++) {
      var min = i;
      for (var j=i+1; j<allEdges.length; j++) {
        if (allEdges[min][2]>allEdges[j][2]) min = j;
        //console.log(allEdges[0][2]);
      }
      //console.log(min,i);
      if (min !== i){
        var temp = allEdges[i];
        allEdges[i] = allEdges[min];
        allEdges[min] = temp;
        //console.log("obmen");
      }
    }
  };
  function deleteNodeFromMass(curId, mass) { //удаляет точку из массива точек
      for(var i=0; i<mass.length; i++) {
          if (mass[i] == curId) {
              mass.splice(i, 1);
              return true;
          }
      }
      return false;
  };
  function drawFinal() { //отрисовка готового графа
      //рисование
    	for(var i=0;i<finalEdges.length;i++){
    		var curEdge = finalEdges[i];
    		var point1 = curEdge[0];
    		var point2 = curEdge[1];

    		var coordinates = [
    			{lat: allNodes[point1].x, lng: allNodes[point1].y},{lat: allNodes[point2].x, lng: allNodes[point2].y}
    		];

    		//color marker
            //console.log(allNodes[point2].par);
            markers[point1].setIcon( getIcon(point1, allNodes[point1].par) );
            markers[point2].setIcon( getIcon(point2, allNodes[point2].par) );

    		var flightPath = new google.maps.Polyline({
    			path: coordinates,
    			geodesic: true,
    			strokeColor: '#FF0000',
    			strokeOpacity: 1.0,
    			strokeWeight: 2
    		});

    		flightPath.setMap(map);

    		polyLines.push(flightPath);
    	}
  };
  function deleteAllPolylinesFromMap() { //удаляет все линиии с карты
    for(var i=0; i<polyLines.length; i++){//удаляет все внешние ребра(polyLines) с карты
      polyLines[i].setMap(null);
    } 

    polyLines = [];
  };
  function deleteEdgeFromMassEdges(curEdge, edgesGood) { //удаляет ребро из массива подходящих ребер
    for(var i=0; i<edgesGood.length; i++) {
      if ( curEdge == edgesGood[i] ) { 
        edgesGood.splice(i, 1);
        return true;
      }
    }
    return false;
  };
  function updateEdgesGood(processed, left) { //обновляет массив edgesGood
    var curMass = [];
    for (var i=0; i<allEdges.length; i++) {
        var curEdge = allEdges[i];
        var nodeId1 = curEdge[0];
        var nodeId2 = curEdge[1];
        //console.log(nodeId1, nodeId2);
        if ( left.indexOf(nodeId1)>-1 && processed.indexOf(nodeId2)>-1
            || left.indexOf(nodeId2)>-1 && processed.indexOf(nodeId1)>-1) {
            curMass.push(curEdge);
        }
    }
    return curMass;
  };
  function deleteAllEdgesFromMassEdges(node, massEdges) { //удаляет все ребра из массива всех ребер
    for(var i=0; i<massEdges.length; i++) {
      var node1 = massEdges[i][0];
      var node2 = massEdges[i][1];

      if ( node == node1 || node == node2 ){
        massEdges.splice(i, 1);
      }
    }
    return true;
  };
  function step(parametr) { //работающий алгоритм по шагам
      //условие прекращения рекурсии if (parametr > 3) return true;
        if (parametr > 3) {
          console.log("Прекращение рекурсии по причине длинных путей");
          return true;
        } 

      //формируем массив processed = []; содержит точки с param=parametr
        var processed = [];
        for (var i=0; i<allNodes.length; i++) {
          if (allNodes[i].par == parametr) {
            processed.push(i);
          }
        }
      //формируем массив left = []; содержит точки с param -1
        var left = [];
        for (var i=0; i<allNodes.length; i++) {
          if ( allNodes[i].par == -1 ) {
            left.push(i);
          }
        }
      //формируем массив edgesGood = [];
        var edgesGood = [];
        edgesGood = updateEdgesGood(processed, left);

        if (edgesGood.length == 0) console.log("edgesGood пуст");

        //console.log("edges good on",parametr," step:",edgesGood);


      var curEdgePos = 0; //текущая позиция обрабатываемого ребра
      while (processed.length > 0 && edgesGood.length > 0) {
          var curEdge = edgesGood[curEdgePos];
          nodeId1 = curEdge[0];
          nodeId2 = curEdge[1];
          if ( processed.indexOf(nodeId1)==-1 ){
            var temp = nodeId1;
            nodeId1 = nodeId2;
            nodeId2 = temp;
          }//теперь в nodeId1 - processed точка, а в nodeId2 - left точка

          //вставляем в массив финальных ребер
            finalEdges.push(curEdge);

          //удалить ребро curEdge из edgesGood
            deleteEdgeFromMassEdges(curEdge, edgesGood);
          //добавить +1 к count точек текущего ребра
            allNodes[nodeId1].count++;
            allNodes[nodeId2].count++;
          //выставить param точке из left
            allNodes[nodeId2].par = parametr + 1;
          //удалить точку из left массива
            deleteNodeFromMass(nodeId2, left);
          //удаляем все ребра из edgesGood, содержащие точку left из текущего ребра;
            deleteAllEdgesFromMassEdges(nodeId2, edgesGood);
            edgesGood = updateEdgesGood(processed, left);

          //если count processed точки ==3, удаляем ее + обновить edgesGood
          //console.log("count ",allNodes[nodeId1]);
          if ( allNodes[nodeId1].count==3 ) {
            //удалить точку из processed массива
              deleteNodeFromMass(nodeId1, processed);
            //обновить edgesGood
              edgesGood = updateEdgesGood(processed, left);
          }
      };

      //условие вхождения в рекурсию if () step(parametr+1);
      if (left.length > 0) step(parametr+1);
  };

//инициализация карты
  function getIcon(text, par = 1) {
      var massColors = [
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
      ];

      console.log(typeof par, par);

      if (!text) text = '•'; //generic map dot
      var iconUrl = "http://chart.googleapis.com/chart?cht=d&chdp=mapsapi&chl=pin%27i\\%27[" + text + "%27-2%27f\\hv%27a\\]h\\]o\\" + massColors[par].fillColor + "%27fC\\" + massColors[par].textColor + "%27tC\\" + massColors[par].outlineColor + "%27eC\\Lauto%27f\\&ext=.png";
      return iconUrl;
  }
  var map = document.getElementById('map'); //создание карты
  map = new google.maps.Map(map, {
     center: {lat: 51.685959, lng: 39.183597},
     zoom: 12
  });

  //поле поиска
    var input = document.getElementById('searchTextField');
    var options = {
      types: ['(regions)'],
    };
    var autocomplete = new google.maps.places.Autocomplete(input, options);
    google.maps.event.addListener(autocomplete, 'place_changed', function() {
      var place = autocomplete.getPlace(); //получаем место
      self.map.panTo(place.geometry.location); //перемещение камеры к объекту
    });

  google.maps.event.addListener(map, 'click', function(e) { //при нажатии на любую точку карты
    var location = e.latLng;
  	var marker = new google.maps.Marker({ //создается маркер
         position: location,
         map: map,
         draggable: true,
         //label: ""+(++labelIndex),
         icon: getIcon( (++labelIndex), 0 )
     });

  	if (!wasFirst) {
  		addNodeToAllNodes(location.lat(),location.lng(),0); //добавление точки в внутренний массив
  		wasFirst = true;
  	}
  	else addNodeToAllNodes(location.lat(),location.lng(),-1);
  	
    table.addRowAndColInMassBool();
    
    markers.push(marker);
    table.showRow(markers.length-1);

    google.maps.event.addListener(marker, "click", function(e) { //при нажатии на маркер
       /*var infoWindow = new google.maps.InfoWindow({
           content: 'x: ' + location.lat() + '<br />y: ' + location.lng()
       });
       infoWindow.open(map, marker);*/
       var curLat = e.latLng.lat();
       var curLng = e.latLng.lng();

       var id = getIdMarkerFromAllMarkers(curLat, curLng);
       if (id>-1) {
           //ПЕРЕДЕЛАТЬ
           $(".side-panel").removeClass("open");
           setTimeout(function() {
               table.showRow(id);

               setTimeout(function() {

                   $(".side-panel").addClass("open");

               }, 500);

           }, 500);


       }
    });

     //перемещение маркера
    google.maps.event.addListener(marker, "dragstart", function(e) {
        var temp = marker.getPosition();
        nodeTemp[0] = {lat: temp.lat(), lng: temp.lng()};
        //deleteAllPolylinesFromMap();
    });
  	google.maps.event.addListener(marker, "drag", function(e) {
      var temp = marker.getPosition();
      nodeTemp[1] = {lat: temp.lat(), lng: temp.lng()};

      deleteAllPolylinesFromMap();

      editNode(nodeTemp[0].lat,nodeTemp[0].lng,nodeTemp[1].lat,nodeTemp[1].lng);

        
  		drawFinal();
  		
  		nodeTemp[0] = nodeTemp[1]
     });
     google.maps.event.addListener(marker, "dragend", function(e) {
        //alert("Выполнение программы приостановилось...");
        main();
        //console.log(edges);
     });
  });

function main() {
  allEdges = []; //все ребра
  finalEdges = []; //финальнон остовное дерево

  //обнулить параметра у точек
  allNodes[0].par = 0;
  allNodes[0].count = 0;
  for(var i=1;i<allNodes.length;i++) {
    allNodes[i].par = -1;
    allNodes[i].count = 0;
  }

  deleteAllPolylinesFromMap();


  table.readFromTable(); //чтение данных из таблицы
  sortAllEdges(); //сортировка массива ребер по их длине

  //console.log("after sorting",allEdges);

  var processedNodes = []; //обрабатываемые точки
  processedNodes.push(0);
    
  //console.log(processedNodes);

  var leftNodes = []; //оставшиеся точки
  for(var i=1;i<allNodes.length;i++) {
    leftNodes.push(i);
  }

  step(0);
  //step(1);
  //console.log("final edges: ",finalEdges);
  drawFinal();
};

//точка входа
$(".button-build").click(function(){
  if (allNodes.length < 2) alert("Недостаточно точек");
    else main();
});