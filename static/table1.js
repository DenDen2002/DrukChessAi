
var createTable = function () {
    var pgn = game.pgn().split(" ");
    var data = [];

    for (var i = 0; i < pgn.length; i += 3) {
        var index = i / 3;
        data[index] = {};
        for (var j = 0; j < 3; j++) {
            var label = "";
            if (j === 0) {
                label = "moveNumber";
            } else if (j === 1) {
                label = "whiteMove";
            } else if (j === 2) {
                label = "blackMove";
            }
            if (pgn.length > i + j) {
                data[index][label] = pgn[i + j];
            } else {
                data[index][label] = "";
            }
        }
    }

    var table = document.getElementById("pgn");
    // Remove existing table rows except for the first row (header)
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }

    for (var i = 0; i < data.length; i++) {
        var newRow = table.insertRow();
        // var moveNumberCell = newRow.insertCell();
        var whiteMoveCell = newRow.insertCell();
        var blackMoveCell = newRow.insertCell();

        // moveNumberCell.textContent = data[i].moveNumber;
        whiteMoveCell.textContent = data[i].whiteMove;
        blackMoveCell.textContent = data[i].blackMove;
    }
};