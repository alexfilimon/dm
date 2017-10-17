var objNodes = {
    nodes: [],

    /*
    {
        lat: 105.1587,
        lng: 165.4564,
        count: 2,
        param: 1, //-1 - означает, что эта точка еще не связана с остальными
        marker: MarkerGoogleMaps
    }
    */

    add: function(lat, lng, marker) { //добавляем точку в массив
        var tmpObj = {
            //lat: lat,
            //lng: lng,
            count: 0,
            param: this.nodes.length > 0 ? -1 : 0,
            marker: marker
        };
        this.nodes.push(tmpObj);
    },
    reset: function() { //сбрасываем счетчики точек
        this.nodes.forEach(function(item) {
            item.param = -1;
            item.count = 0;
        });
        this.nodes[0].param = this.nodes[0].count = 0;
    },
    getId: function(lat, lng) {
        this.nodes.forEach(function(item, i) {
            if (item.marker.getPosition().lat() === lat && item.marker.getPosition().lng() === lng) {
                return i;
            }
        });
        return -1;
    },
    deleteNodeFromCustomArr: function(nodeId, arr) {
        var id = arr.indexOf(nodeId);
        arr.splice(id, 1);
    }

};