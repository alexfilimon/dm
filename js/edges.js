var objEdges = {
    edges: [],

    /*
    {
        node: 1  // idNodeWithLowerPar,
        node: 2  // idNode
        distance: 125.546,
        final: true/false,
        polyline: PolylineGoogleMaps
    }
    */
    add: function(id1, id2) {//недоделана

        /*if (objNodes.nodes[id1].param > objNodes.nodes[id2].param) {
            var tmp = id1;
            id1 = id2;
            id2 = tmp;
        }*/

        //distance
        //var latLng1 = new google.maps.LatLng(objNodes.nodes[id1].lat, objNodes.nodes[id1].y);
        //var latLng2 = new google.maps.LatLng(objNodes.nodes[id2].x, objNodes.nodes[id2].y);
        var distance = google.maps.geometry.spherical.computeDistanceBetween(objNodes.nodes[id1].marker.getPosition(), objNodes.nodes[id2].marker.getPosition());

        var tmpObj = {
            node1: id1,
            node2: id2,
            distance: distance,
            final: false,
            polyline: null
        };
        this.edges.push(tmpObj);
    },
    final: function(edge) {
        var idEdge = this.edges.indexOf(edge);
        this.edges[idEdge].final = true;
    },
    deleteEdgeFromCustomArr: function(edge, arr) {
        var id = arr.indexOf(edge);
        arr.splice(id, 1);
    },
    updateEdgesGood: function(arrNodes1, arrNodes2) {
        var arr = [];
        this.edges.forEach(function(item, i) {
            if ( arrNodes1.indexOf(item.node1) > -1 && arrNodes2.indexOf(item.node2) > -1 ||
                arrNodes1.indexOf(item.node2) > -1 && arrNodes2.indexOf(item.node1) > -1) {
                arr.push(item);
            }
        });
        return arr;
    },
    sort: function() {
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