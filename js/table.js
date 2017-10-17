var table = {
    massBool: [], //массив булианов, отражающий возможные ребра
    shownId: 0,           //текущая показываемая точка в боковом меню

    showRow: function (idNode) { //показать строку(из массива булеанов) в боковом меню по id точки
        this.shownId = idNode;
        var out = "<div class>Точка "+ idNode +" имеет связи с точками: </div>";
        out = out +"<table>"; //то, что будет вставляться в html страницу

        for(var i=0; i<this.massBool.length; i++){ //генерируется сама таблица
            var out = out+"<tr>";

            out = out+"<td>"+i+"</td>";
            if (i == idNode) {
                out = out+"<td>"+"-"+"</td>";
            } else {
                var checked = "";
                if ( this.massBool[i][idNode] == true ) checked = "checked";
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
            this.massBool[curx][cury] = ($("#"+cur).prop('checked'));
            this.massBool[cury][curx] = ($("#"+cur).prop('checked'));
        });
    },

    addNode: function () { //добавить строку и столбец в массив булеанов
        var size = this.massBool.length;

        var curMass = [];
        for(var i=0; i<size; i++) {
            curMass.push(true);
        }

        this.massBool.push(curMass);

        for(var i=0; i<size+1; i++) {
            this.massBool[i].push(true);
        }
    },

    readFromTable: function readFromTable() { //читает ребра из таблицы
        var size = this.massBool.length;

        for(var i=0; i<size; i++) {
            for(var j=i+1; j<size; j++) {
                /*if (i<10) var i1 = "0"+i;
                else var i1 = i;
                if (j<10) var j1 = "0"+j;
                else var j1 = j;*/

                if ( this.massBool[i][j] === true ) {
                    var idNode1 = i; //id точки
                    var idNode2 = j; //id другой точки

                    objEdges.add(idNode1, idNode2);
                }
            }
        }
    }
};