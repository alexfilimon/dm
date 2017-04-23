//глобальные массивы
  var allEdges = []; //все ребра
  var allNodes = []; //все точки
  var finalEdges = []; //финальнон остовное дерево

//глобальные переменные
  var labelIndex = -1; //кол-во точек
  var wasFirst = false; //была ли первая точка


//функции
  function addNodeToAllNodes(x, y, param) {
    var tempObject = {
      x: x,
      y: y,
      par: param,
      count: 0
    };
    allNodes.push(tempObject);
  };
  function generateTable() { //генерируется таблица для 2-го шага
    var out = "<table>"; //то, что будет вставляться в html страницу

    for(var i=-1; i<=labelIndex; i++){ //генерируется сама таблица
      var out = out+"<tr>";
      for(var j=-1; j<=labelIndex; j++) {
        if (i==-1 && j>-1){
          out = out+"<td>"+j+"</td>";
        }else if (j==-1 && i>-1) {
          out = out+"<td>"+i+"</td>";
        } else if (i==j) {
          out = out+"<td class='dis'></td>";
        } else {
          if (i<10) var iInsert = "0"+i;
          else var iInsert = i;
          if (j<10) var jInsert = "0"+j;
          else var jInsert = j;
          out = out+"<td><input type='checkbox' checked id='"+iInsert+jInsert+"' class='tableCheck' name='check'></td>";
        } 
      }
      out = out+"</tr>";
    }

    $("#wrap-table").html(out); //вставляется сгенерированное сообщение в отдельный блок #wrap-table

    $(".tableCheck").change(function() { //генерация события изменения checkbox-ов
      var id=this.id;

      //console.log($("#"+id).prop('checked'));

      if ($("#"+id).prop('checked')){
        $("#"+id.substr(-2,2)+id.substr(0,2)+"").prop("checked",true);
      } else {
        $("#"+id.substr(-2,2)+id.substr(0,2)+"").prop("checked",false);
      }
    });
  };
  function readFromTable() { //читает ребра из таблицы
    
    for(var i=0; i<=labelIndex+1; i++) {
      for(var j=i; j<=labelIndex+1; j++){
        if (i<10) var i1 = "0"+i;
        else var i1 = i;
        if (j<10) var j1 = "0"+j;
        else var j1 = j;
        
        if ($("#"+i1+j1).prop("checked")) { //если выбрано
          var curEdge = []; //текущее ребро
          var point1 = i; //id точки
          var point2 = j; //id другой точки

          //формирование текущего ребра
          curEdge.push(point1);
          curEdge.push(point2);
          curEdge.push(Math.sqrt((allNodes[point1].x-allNodes[point2].x)*(allNodes[point1].x-allNodes[point2].x)+(allNodes[point1].y-allNodes[point2].y)*(allNodes[point1].y-allNodes[point2].y)));
          //вставка текущего ребра в массив всех ребер
          allEdges.push(curEdge);
        }
      }
    }
  };
  function sortAllEdges() {
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
  function deleteNodeFromMass(curId, processedMass) { //удаляет точку из массива точек
      for(var i=0; i<processedMass; i++) {
          var curNode = processedMass[i];
          if (curNode = curId) {
              processedMass.splice(i, 1);
          } 
          return true;
      }
      return false;
  };
  function drawFinal() {
      //рисование
	for(var i=0;i<finalEdges.length;i++){
		var curEdge = finalEdges[i];
		var point1 = curEdge[0];
		var point2 = curEdge[1];

		var coordinates = [
			{lat: allNodes[point1].x, lng: allNodes[point1].y},{lat: allNodes[point2].x, lng: allNodes[point2].y}
		];

		var flightPath = new google.maps.Polyline({
			path: coordinates,
			geodesic: true,
			strokeColor: '#FF0000',
			strokeOpacity: 1.0,
			strokeWeight: 2
		});

		flightPath.setMap(map);

		//polyLines.push(flightPath);
	}
  };
  function updateEdgesGood(edgesGood, processed, left) {
      edgesGood = [];
    for (var i=0; i<allEdges.length; i++) {
        var curEdge = allEdges[i];
        var nodeId1 = curEdge[0];
        var nodeId2 = curEdge[1];
        //console.log(nodeId1, nodeId2);
        if ( left.indexOf(nodeId1)>-1 && processed.indexOf(nodeId2)>-1
            || left.indexOf(nodeId2)>-1 && processed.indexOf(nodeId1)>-1) {
            edgesGood.push(curEdge);
        }
      }
  };
  function step(parametr) {
      //условие прекращения рекурсии if (parametr > 3) return true;

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
        updateEdgesGood(edgesGood, processed, left);

        console.log(edgesGood);


      var curEdgePos = 0; //текущая позиция обрабатываемого ребра
      while (processed.length > 0 && edgesGood.length > 0) {
          var curEdge = edgesGood[curEdgePos];
          nodeId1 = curEdge[0];
          nodeId2 = curEdge[1];
          if ( processed.indexOf(nodeId1)==-1 ){
            var temp = nodeId1;
            nodeId1 = nodeId2;
            nodeId2 = temp;
          }
          finalEdges.push(curEdge);

          //удалить ребро curEdge из edgesGood
          //добавить +1 к count точек текущего ребра
            allNodes[node1Id].count++;
            allNodes[node2Id].count++;
          //выставить param точке из left
            allNodes[nodeId2].par = parametr + 1;
          //удалить точку из left массива
          //удаляем все ребра из edgesGood, содержащие точку left из текущего ребра; обновляем edgesGood


          //если count processed точки ==3, удаляем ее + обновить edgesGood
          if ( allNodes[nodeId1]==3 ) {
            //удалить ее из processed массива
            //обновить edgesGood
          }
      };

      //условие вхождения в рекурсию if () step(parametr+1);


  };



//инициализация карты
  var map = document.getElementById('map'); //создание карты
  map = new google.maps.Map(map, {
     center: {lat: 51.685959, lng: 39.183597},
     zoom: 12
  });
  google.maps.event.addListener(map, 'click', function(e) { //при нажатии на любую точку карты
         
    var location = e.latLng;
  	var marker = new google.maps.Marker({ //создается маркер
         position: location,
         map: map,
         draggable: false,
         label: ""+(++labelIndex)
     });

  	if (!wasFirst) {
  		addNodeToAllNodes(location.lat(),location.lng(),0); //добавление точки в внутренний массив
  		wasFirst = true;
  	}
  	else addNodeToAllNodes(location.lat(),location.lng(),-1);
  	
    generateTable();

    google.maps.event.addListener(marker, "click", function(e) { //при нажатии на маркер
       var infoWindow = new google.maps.InfoWindow({
           content: 'x: ' + location.lat() + '<br />y: ' + location.lng()
       });
       infoWindow.open(map, marker);
    });

     //перемещение маркера
     /*google.maps.event.addListener(marker, "dragstart", function(e) {
        var temp = marker.getPosition();
        nodeTemp[0] = {lat: temp.lat(), lng: temp.lng()};
        deleteAllPolylinesFromMap();
        

     });
  	google.maps.event.addListener(marker, "drag", function(e) {
        var temp = marker.getPosition();
        nodeTemp[1] = {lat: temp.lat(), lng: temp.lng()};

        editNode(nodeTemp[0].lat,nodeTemp[0].lng,nodeTemp[1].lat,nodeTemp[1].lng);

        
  		//drawAllEdges();
  		
  		nodeTemp[0] = nodeTemp[1]
     });
     google.maps.event.addListener(marker, "dragend", function(e) {
        alert("Выполнение программы приостановилось...");
        main();
        //console.log(edges);
     });*/
  });

function main() {
  readFromTable(); //чтение данных из таблицы
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
  //console.log(finalEdges);
  //drawFinal();

  
};

//точка входа
$(".go").click(function(){
  main();
});