var objNodes = {
    nodes: [],

    /* структура объекта точки
    {
        count: 2, //кол-во смежных точек
        param: 1, //дальность от нулевой точки (-1 - означает, что эта точка еще не связана с остальными)
        marker: MarkerGoogleMaps //объект гугл карт
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
        this.nodes[0].param = 0;
        this.nodes[0].count = 0;
    },
    getId: function(marker) { //получаем id точки по переданному гугл маркеру
        var ret = -1;
        this.nodes.forEach(function(item, i) {
            if (item.marker === marker) {
                ret = i;
                return true;
            }
        });
        return ret;
    },
    deleteNodeFromCustomArr: function(nodeId, arr) { //даляем точку из  кастомного массива точек(передается в параметрах)
        var id = arr.indexOf(nodeId);
        arr.splice(id, 1);
    },
    deleteNode: function(id) {
        objView.deleteNodeFromMap(id);
        this.nodes.splice(id, 1);
    }
};