var objEdges = {
    edges: [],

    /* объект "ребро"
    {
        node: 1,  // id первой точки
        node: 2,  // id второй точки
        distance: 125.546, //расстояние между точками
        final: true/false, //final ребра, которые позже будут отрисованы на карте
        polyline: PolylineGoogleMaps //объект гугл карт
    }
    */

    add: function(id1, id2) { //добавляет ребро в массив

        //ищем расстояние между двумя точками
        var distance = google.maps.geometry.spherical.computeDistanceBetween(objNodes.nodes[id1].marker.getPosition(), objNodes.nodes[id2].marker.getPosition());
        //создаем объект, который затем поместим в массив
        var tmpObj = {
            node1: id1,
            node2: id2,
            distance: distance,
            final: false,
            polyline: null
        };
        this.edges.push(tmpObj);
    },
    final: function(edge) { //делает определенное ребро final(т.е. помечает, что оно позже будет отрисовано на карте)
        var idEdge = this.edges.indexOf(edge);
        this.edges[idEdge].final = true;
    },
    deleteEdgeFromCustomArr: function(edge, arr) { //удаляет ребро из кастомного массива ребер(все это передается параметрами)
        var id = arr.indexOf(edge);
        arr.splice(id, 1);
    },
    createEdgesGood: function(arrNodes1, arrNodes2) { //заново пересоздает массив edgesGood(в нем хранятся пригодные на этом шаге ребра)
        var arr = [];
        this.edges.forEach(function(item, i) {
            if ( arrNodes1.indexOf(item.node1) > -1 && arrNodes2.indexOf(item.node2) > -1 ||
                arrNodes1.indexOf(item.node2) > -1 && arrNodes2.indexOf(item.node1) > -1) {
                arr.push(item);
            }
        });
        return arr;
    },
    sort: function() { //сортирует массив ребер по возрастанию расстояний между точками
        for(var i=0; i<this.edges.length-1; i++) {
            var min = i;
            for (var j=i+1; j<this.edges.length; j++) {
                if (this.edges[min].distance > this.edges[j].distance) min = j;
                //console.log(allEdges[0][2]);
            }
            //console.log(min,i);
            if (min !== i){
                var temp = this.edges[i];
                this.edges[i] = this.edges[min];
                this.edges[min] = temp;
                //console.log("obmen");
            }
        }
    }
};