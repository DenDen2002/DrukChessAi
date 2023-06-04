$(".navTrigger").click(function () {
  $(this).toggleClass("active");
  console.log("Clicked menu");
  $("#mainListDiv").toggleClass("show_list");
  $("#mainListDiv").fadeIn();
});
var board,
  game = new Chess(),
  statusEl = $("#status"),
  fenEl = $("#fen"),
  pgnEl = $("#pgn");

// do not pick up pieces if the game is over
// only pick up pieces for the side to move
var onDragStart = function (source, piece, position, orientation) {
  if (
    game.game_over() === true ||
    (game.turn() === "w" && piece.search(/^b/) !== -1) ||
    (game.turn() === "b" && piece.search(/^w/) !== -1)
  ) {
    return false;
  }
};

var onDrop = function (source, target) {
  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: "q", // NOTE: always promote to a queen for example simplicity
  });

  // illegal move
  if (move === null) return "snapback";

  updateStatus();
  createTable();
  getResponseMove();
};

// update the board position after the piece snap
// for castling, en passant, pawn promotion
var onSnapEnd = function () {
  board.position(game.fen());
};

var updateStatus = function () {
  var status = "";

  var moveColor = "White";
  if (game.turn() === "b") {
    moveColor = "Black";
  }

  // checkmate?
  if (game.in_checkmate() === true) {
    status = "Checkmate!";
  }

  // draw?
  else if (game.in_draw() === true) {
    status = "Draw!";
  }

  // game still on
  else {
    status = moveColor + " to move";

    // check?
    if (game.in_check() === true) {
      status += ", " + moveColor + " is in check";
    }
  }

  statusEl.html(status);
  fenEl.html(game.fen());
  pgnEl.html(game.pgn());
};

var cfg = {
  draggable: true,
  position: "start",
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd,
};

var randomResponse = function () {
  fen = game.fen();
  $.get($SCRIPT_ROOT + "/move/" + fen, function (data) {
    game.move(data, { sloppy: true });
    // board.position(game.fen());
    updateStatus();
  });
};

var getResponseMove = function () {
  var e = document.getElementById("sel1");
  var depth = 2;
  fen = game.fen();
  $.get($SCRIPT_ROOT + "/move/" + depth + "/" + fen, function (data) {
    game.move(data, { sloppy: true });
    updateStatus();
    createTable();
    setTimeout(function () {
      board.position(game.fen());
    }, 100);
  });
};

setTimeout(function () {
  board = ChessBoard("board", cfg);
}, 0);

var setPGN = function () {
  var table = document.getElementById("pgn");
  var pgn = game.pgn().split(" ");
  var move = pgn[pgn.length - 1];
};

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

  var tableContainer = document.getElementById("tableContainer");
  var table = document.getElementById("pgn");
  // Remove existing table rows except for the first row (header)
  while (table.rows.length > 1) {
    table.deleteRow(1);
  }

  for (var i = 0; i < data.length; i++) {
    var newRow = table.insertRow();
    var moveNumberCell = newRow.insertCell();
    var whiteMoveCell = newRow.insertCell();
    var blackMoveCell = newRow.insertCell();

    moveNumberCell.textContent = data[i].moveNumber;
    whiteMoveCell.textContent = data[i].whiteMove;
    blackMoveCell.textContent = data[i].blackMove;
  }
};

var updateScroll = function () {
  $("#moveTable").scrollTop($("#moveTable")[0].scrollHeight);
};

var setStatus = function (status) {
  document.getElementById("status").innerHTML = status;
};

var takeBack = function () {
  game.undo();
  if (game.turn() != "w") {
    game.undo();
  }
  board.position(game.fen());
  updateStatus();
};
var clearTable = function () {
  var table = document.getElementById("pgn");
  // Remove existing table rows except for the first row (header)
  while (table.rows.length > 1) {
    table.deleteRow(1);
  }
};

var newGame = function () {
  game.reset();
  board.start();
  updateStatus();
  clearTable();
};

var getCapturedPieces = function () {
  var history = game.history({ verbose: true });
  for (var i = 0; i < history.length; i++) {
    if ("captured" in history[i]) {
      console.log(history[i]["captured"]);
    }
  }
};

var getLastCapture = function () {
  var history = game.history({ verbose: true });
  var index = history.length - 1;

  if (history[index] != undefined && "captured" in history[index]) {
    console.log(history[index]["captured"]);
  }
};

// Get the restart button element
const restartButton = document.querySelector("#restartBtn");

// // Get the dmoves container element
// const dmovesContainer = document.querySelector("#dmoves");

// Define the restart function
// function restartMainWindow() {
//   // Code to restart the mainWindow goes here
//   // For example, you can reload the page to restart the entire application
//   window.location.reload();
// }
function exitGame() {
  // Add any necessary cleanup or game termination logic here
  // For example, you might want to stop any ongoing game processes or reset variables

  // Redirect to the index page
  window.location.href = "menu";
}

// function updateMoves(move) {
//   const moveParagraph = document.createElement("p");
//   moveParagraph.textContent = move;

// Append the new move to the container
//   dmovesContainer.appendChild(moveParagraph);
// }

// Add a click event listener to the restart button
restartButton.addEventListener("click", newGame);

// Example usage of updateMoves function (replace it with your actual code)
// updateMoves("e2-e4"); // Display move "e2-e4"
