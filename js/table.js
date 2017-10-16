var table = {
    massBoolForTable: [], //массив булианов, отражающий возможные ребра
    shownId: 0,           //текущая показываемая точка в боковом меню

    showRow: function (idNode) { //показать строку(из массива булеанов) в боковом меню по id точки
        this.shownId = idNode;
        var out = "<div class>Точка "+ idNode +" имеет связи с точками: </div>";
        out = out +"<table>"; //то, что будет вставляться в html страницу

        for(var i=0; i<this.massBoolForTable.length; i++){ //генерируется сама таблица
            var out = out+"<tr>";

            out = out+"<td>"+i+"</td>";
            if (i == idNode) {
                out = out+"<td>"+"-"+"</td>";
            } else {
                var checked = "";
                if ( this.massBoolForTable[i][idNode] == true ) checked = "checked";
                if (i<10) var iInsert = "0"+i;
                else var iInsert = i;
                if (idNode<10) var jInsert = "0"+idNode;
                else var jInsert = idNode;
                out = out+"<td><input type='checkbox' id='"+iInsert+jInsert+"' class='checkbox' name='check' "+checked+"></td>";
            }

            out = out+"</tr>";


        }
        out = out+"</table>";

        $("#wrap-table").html(out); //вставляется сгенерированное сообщение в отдельный блок #wrap-table

        $(".checkbox").on("change",function(e) {
            //console.log($(this).attr("id"));
            var cur = $(this).attr("id");
            var curx = Number(cur.substr(0,2));
            var cury = Number(cur.substr(2,2));
            console.log(curx, cury);
            this.massBoolForTable[curx][cury] = ($("#"+cur).prop('checked'));
            this.massBoolForTable[cury][curx] = ($("#"+cur).prop('checked'));
        });
    },

    addRowAndColInMassBool: function () { //добавить строку и столбец в массив булеанов
        var size = this.massBoolForTable.length;

        var curMass = [];
        for(var i=0; i<size; i++) {
            curMass.push(true);
        }

        this.massBoolForTable.push(curMass);

        for(var i=0; i<size+1; i++) {
            this.massBoolForTable[i].push(true);
        }
    },

    readFromTable: function readFromTable() { //читает ребра из таблицы
        var size = this.massBoolForTable.length;

        for(var i=0; i<size; i++) {
            for(var j=i; j<size; j++) {
                /*if (i<10) var i1 = "0"+i;
                else var i1 = i;
                if (j<10) var j1 = "0"+j;
                else var j1 = j;*/

                if ( this.massBoolForTable[i][j] === true ) {
                    var curEdge = []; //текущее ребро
                    var point1 = i; //id точки
                    var point2 = j; //id другой точки

                    //формирование текущего ребра
                    curEdge.push(point1);
                    curEdge.push(point2);
                    var latLng1 = new google.maps.LatLng(allNodes[point1].x, allNodes[point1].y);
                    var latLng2 = new google.maps.LatLng(allNodes[point2].x, allNodes[point2].y);
                    var distance = google.maps.geometry.spherical.computeDistanceBetween(latLng1, latLng2);
                    curEdge.push(distance);
                    //вставка текущего ребра в массив всех ребер
                    allEdges.push(curEdge);
                }
            }
        };
    }
};