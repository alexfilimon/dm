var table = {
    massBool: [], //массив булианов, отражающий возможные ребра

    showRow: function (idNode) { //показать строку(из массива булеанов) в боковом меню по id точки
        var table = "<table>"; //то, что будет вставляться в html страницу
        //проходим по всей таблице
        for(var i=0; i<this.massBool.length; i++){ //генерируется сама таблица
            table += "<tr>";

            table += "<td>Точка " + i + "</td>";
            //если текущий номер равен переданному id точки
            if (i == idNode) {
                table += "<td>"+"-"+"</td>";
            } else {
                //актвирован ли чекбокс
                    var checked = "";
                    if ( this.massBool[i][idNode] === true ) checked = "checked";
                //формируем html-id точки
                    var iInsert, jInsert;
                    iInsert = i<10 ? ("0" + i) : i ;
                    jInsert = idNode<10 ? ("0"+idNode) : idNode ;
                    table += "<td><div class='checkbox'><input type='checkbox' id='"+iInsert+jInsert+"' name='check' "+checked+"><label for="+iInsert+jInsert+"></label></div></td>";
            }

            table += "</tr>";


        }
        table += "</table>";

        //вставляется сгенерированное сообщение в отдельный блок
        $(".table-content").html(table);

        //название точки
        $(".name-node").text(idNode);

        // TODO сделать кнопку удаления и назначит ей обработчик

        //обработчики событий чекбоксов
        checkboxOnClick();

        //показываем таблицу
        objView.showTable();
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
function checkboxOnClick() { //обработчик изменения чекбоксов
    $(".checkbox input").on("change",function() {
        var cur = $(this).attr("id");
        var curx = Number(cur.substr(0,2));
        var cury = Number(cur.substr(2,2));

        table.massBool[curx][cury] = $("#"+cur).prop('checked');
        table.massBool[cury][curx] = $("#"+cur).prop('checked');
    });
}