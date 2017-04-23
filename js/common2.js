//функции внутренних точек и ребер
function addNodeToNodes(x, y, par) { //добавляет точку в внутренний массив точек
	var tempObj = {
		x: x,
		y: y,
		par: par,
		id: -1,
		count: 0
	};
	nodes.push(tempObj);
};
function editNode(oldX,oldY,newX,newY){ //редактирует координаты точки
	for(var i=0;i<nodes.length;i++){
		if (nodes[i].x == oldX && nodes[i].y == oldY){
			nodes[i].x = newX;
			nodes[i].y = newY;
			return true;
		}
	}
};
function readFromTable() {
	for(var i=1;i<labelIndex;i++) {
		for(var j=i+1; j<labelIndex; j++){
			if (i<10) var i1 = "0"+i;
			else var i1 = i;
			if (j<10) var j1 = "0"+j;
			else var j1 = j;
			//console.log("#"+i1+j1,$("#"+i1+j1).prop("checked"));
			if ($("#"+i1+j1).prop("checked")) {
				var curEdge = [];
				var point1 = nodes[i-1];
				var point2 = nodes[j-1];
				point1.id = i;
				point2.id = j;

				curEdge.push(point1);
				curEdge.push(point2);
				curEdge.push(Math.sqrt((point1.x-point2.x)*(point1.x-point2.x)+(point1.y-point2.y)*(point1.y-point2.y)));
				edges.push(curEdge);
			}
		}
	}
};
function deleteNodeFromMassNodes(object, mass) {
	for(var i=0;i<mass.length;i++){
		if (mass[i] == object){
			console.log("nashel");
			mass.splice(i,1);
			return true;
		}
	} return false;
};


//функции внешних точек и ребер
function drawAllEdges(edges) { //рисует все внутренние ребра и вставляет внутренние ребра в массив внешних
	//удаление
	deleteAllPolylinesFromMap();


	//рисование
	for(var i=0;i<edges.length;i++){
		var curEdge = edges[i];
		var point1 = curEdge[0];
		var point2 = curEdge[1];

		var coordinates = [
			{lat: point1.x, lng: point1.y},{lat: point2.x, lng: point2.y}
		];

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
function calculateEdges() {
	//пересчет расстояний
	for(var i=0;i<edges.length;i++){
		var curEdge = edges[i];
		var point1 = curEdge[0];
		var point2 = curEdge[1];

		curEdge[2] = Math.sqrt((point1.x-point2.x)*(point1.x-point2.x)+(point1.y-point2.y)*(point1.y-point2.y));
		edges[i] = curEdge;
	}
};
function deleteAllPolylinesFromMap() { //удаляет все линиии с карты
	for(var i=0; i<polyLines.length; i++){//удаляет все внешние ребра(polyLines) с карты
   	polyLines[i].setMap(null);
   } 

	polyLines = [];
};
function sortMassEdges() {
	var edgesCopy = edges.slice();
	for(var i=0;i<edgesCopy.length-1;i++) {
		var min = i;
		for (var j=i+1;j<edgesCopy.length;j++) {
			if (edgesCopy[min][2]>edgesCopy[j][2]) min = j;
			//console.log(edgesCopy[0][2]);
		}
		//console.log(min,i);
		if (min !== i){
			var temp = edgesCopy[i];
			edgesCopy[i] = edgesCopy[min];
			edgesCopy[min] = temp;
			//console.log("obmen");
		}
	}
	
	return edgesCopy;
};

function generateTable() {
	var out = "<table>";

	for(var i=0; i<labelIndex; i++){
		var out = out+"<tr>";
		for(var j=0; j<labelIndex; j++) {
			if (i==0 && j>0){
				out = out+"<td>"+j+"</td>";
			}else if (j==0 && i>0) {
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

	$("#wrap-table").html(out);

	$(".tableCheck").change(function() {
		var id=this.id;

		//console.log($("#"+id).prop('checked'));

		if ($("#"+id).prop('checked')){
			$("#"+id.substr(-2,2)+id.substr(0,2)+"").prop("checked",true);
		} else {
			$("#"+id.substr(-2,2)+id.substr(0,2)+"").prop("checked",false);
		}
	});
};

function oneNodeInEdge(massNodes, edge) {
	for (var i=0;i<massNodes.length;i++){
		var pos = edge.indexOf(massNodes[i]);
		var pos2;
		if (pos == 1) pos2 = 0;
		else if (pos==0) pos2 = 1;
		else pos2 = 2;
		//console.log(pos,pos2);
		if ( pos>-1 &&  massNodes.indexOf(edge[pos2])==-1 ) return true
	}
	return false;
};

function makeStep(sortEdges, massAllNodesExceptProcessed, processedNodes, par) {
	//надо сделать отсортированный по возрастанию массив ребер, выходящих из этих точек
	var curEdges = [];
	for(var i=0;i<sortEdges.length;i++) {
		if ( oneNodeInEdge(processedNodes,sortEdges[i]) ) {
			curEdges.push(sortEdges[i]);
		}
	}

	var i = 0;
	var point1;
	var point2;

	do {
		point1 = curEdges[i][0];
		point2 = curEdges[i][1];

		minEdges.push(curEdges[i]);


		point1.count++;
		point2.count++;
		i++;
	} while (point1.count < 3 && point2.count < 3 && i<curEdges.length);

	console.log("текущие ребра на 0-вом шаге",minEdges);


};


var nodes = []; //внутренний массив точек
var edges = []; //внутренний массив ребер(допустимых)
var minEdges = [];
var markers = []; //массив точек внешний
var polyLines = []; //массив внешних ребер(всех)
var labelIndex = 1; //нумерация точек
var wasFirst = false;

var nodeTemp = []; //временное хранилище точек для перемещения


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
       draggable: true,
       label: ""+labelIndex++
   });

	if (!wasFirst) {
		addNodeToNodes(location.lat(),location.lng(),0); //добавление точки в внутренний массив
		wasFirst = true;
	}
	else addNodeToNodes(location.lat(),location.lng(),-1);
	generateTable();

   google.maps.event.addListener(marker, "click", function(e) { //при нажатии на маркер
       var infoWindow = new google.maps.InfoWindow({
           content: 'x: ' + location.lat() + '<br />y: ' + location.lng()
       });
       infoWindow.open(map, marker);
   });

   //перемещение маркера
   google.maps.event.addListener(marker, "dragstart", function(e) {
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
   });
});

//console.log(google.maps.Marker);

function main() {
	edges = []; //внутренний массив ребер(допустимых)
	minEdges = [];

	readFromTable();

	if (edges.length < 1) alert("Ни одного ребра не задано");
	else{
		//drawAllEdges();
		calculateEdges();
		var sortEdges = sortMassEdges(); //отсортированные ребра

		//console.log(edges);
		//console.log(sortEdges);

		var massAllNodes = nodes.slice();
		var massNodeProcessed = [];
		massNodeProcessed.push(nodes[0]);

		console.log("do udal",massAllNodes);

		deleteNodeFromMassNodes(nodes[0], massAllNodes);

		console.log("posle udal",massAllNodes);
		console.log("obrabativaemie",massNodeProcessed);

		makeStep(sortEdges, massAllNodes, massNodeProcessed, 0);
		drawAllEdges(minEdges);
	}


	
};



$(".go").click(function(){
	main();
});

function step(processed, left, parametr) {
    if ( left.length>0 && processed.length>0 ) { //если есть точки в двух входных массивах

        //console.log("processed:",processed);

        var edgesGood = []; //удовлетворяющие ребра
        //получаем массив нужных ребер egesGood
        //[сделать]
        //1-e удалить из массива всех ребер такие ребра, которые состоят из processed точек

        //2-е пройти по всем ребрам и выбрать те, в которых (строго)одна точка входит в массив processed
        for(var i=0; i<allEdges.length; i++) {
            var curEdge = allEdges[i];
            var node1 = curEdge[0];
            var node2 = curEdge[1];
            if ( processed.indexOf(node1)>-1 && processed.indexOf(node2)==-1
                || processed.indexOf(node2)>-1 && processed.indexOf(node1)==-1 ) {
                edgesGood.push(curEdge);
            }
        }

        console.log(edgesGood);

        var position = -1;

        var k=0;

        while( left.length>0 && processed.length>0 && k<3 ) {
            //k++;
            //1-е (добавляем ребро<+> + incr степень его точек<+> + выставляем param<+>) точкам
            var curEdge = edgesGood[++position];
            finalEdges.push(curEdge);

            console.log("curEdge: ",curEdge);

            var node1 = curEdge[0];
            var node2 = curEdge[1];
            allNodes[node1].count++;
            allNodes[node2].count++;

            allNodes[node1].param = parametr + 1;
            allNodes[node2].param = parametr + 1;


            if (processed.indexOf(node1)>-1) {
                deleteNodeFromMass(node2, left);
            } else {
                deleteNodeFromMass(node1, left);
            }

            console.log("оставшиеся точки: ",left);

            //2-е (проверяем степень processed точек и если что удаляем) <+>
            for(var i=0; i<processed.length; i++) {
                var cur = processed[i]; //id обрабатываемой точки
                var curCount = allNodes[cur].count;
                if ( curCount == 3 ) {
                    //удаляем точку cur из массива processed
                    deleteNodeFromMass(cur, processed);
                }
            }

        }

		/*if (left.length>0) {
		 //формируем массив обрабатываемых вершин
		 //[сделать]

		 //формируем массив остальных вершин
		 //[сделать]

		 //step(,,param+1);
		 }*/



    }
};