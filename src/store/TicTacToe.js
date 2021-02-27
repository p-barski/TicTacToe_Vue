export const TicTacToeModule = {
  namespaced: true,
  state: {
    socket: null,
    size: 3,
    mySign: null,
    opponentSign: null,
    myTurn: null,
    board: [["...", "...", "..."], ["...", "...", "..."], ["...", "...", "..."]]
  },

  mutations: {
    CONNECT_TO_SERVER(state) {
      state.socket = new WebSocket("ws://localhost:5000");
    },

    CREATE_EMPTY_BOARD(state, size) {
      state.board = []
      state.size = size;

      for (let y = 0; y < size; y++) {
        const row = [];
        for (let x = 0; x < size; x++) {
          row.push("...");
        }
        state.board.push(row);
      }
    },

    SET_TURN(state, text) {
      state.myTurn = text;
    },

    CLEAR_STATE(state) {
      state.mySign = null;
      state.opponentSign = null;
      state.myTurn = null;
    },

    START_OF_GAME(state, turn) {
      state.myTurn = turn;
      if (turn) {
        state.mySign = "O";
        state.opponentSign = "X";
        return;
      }
      state.mySign = "X";
      state.opponentSign = "O";
    },

    SUCCESSFUL_MOVE(state, msg) {
      if (state.myTurn) {
        state.board[msg.X][msg.Y] = state.mySign;
      }
      else {
        state.board[msg.X][msg.Y] = state.opponentSign;
      }
      state.myTurn = !state.myTurn;
    },

    WINNING(state) {
      state.myTurn = "You Won";
    },

    LOSING(state) {
      state.myTurn = "You Lost";
    },

    DRAWING(state) {
      state.myTurn = "It's a draw";
    },
  },

  actions: {
    connectToServer({ commit, state }) {
      commit("CONNECT_TO_SERVER");
      state.socket.onmessage = function (event) {
        const msg = JSON.parse(event.data);
        if (msg.IsClientTurn != null) {
          commit("START_OF_GAME", msg.IsClientTurn)
        }
        else if (["Success", "YouLose", "YouWin", "Draw"].includes(msg.Message)) {
          commit("SUCCESSFUL_MOVE", msg);
          if (msg.Message === "YouLose") {
            commit("CLEAR_STATE")
            commit("LOSING");
          } else if (msg.Message === "YouWin") {
            commit("CLEAR_STATE")
            commit("WINNING");
          } else if (msg.Message === "Draw") {
            commit("CLEAR_STATE")
            commit("DRAW");
          }
        }
        else if (msg.Reason === "Other player closed the game.") {
          commit("CLEAR_STATE");
          commit("CREATE_EMPTY_BOARD", state.size)
        }
      };
    },

    async findGame({ commit, state }, size) {
      commit("CLEAR_STATE");
      commit("CREATE_EMPTY_BOARD", size);
      commit("SET_TURN", "Searching for a game");
      if (state.socket && state.socket.readyState === WebSocket.OPEN) {
        await state.socket.send(JSON.stringify({ "Size": size }));
      }
    },

    async makeMove({ state }, data) {
      const msg = JSON.stringify({ "X": data.x, "Y": data.y });
      await state.socket.send(msg);
    },
  },
}