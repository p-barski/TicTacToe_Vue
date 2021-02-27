<template>
  <div class="top-bar" :class="{ '--disconnected': !isSocketConnected }">
    <NewGameWindow :isConnected="isSocketConnected"></NewGameWindow>
    <div class="turn-div">{{ turn }}</div>
    <div>
      <div
        class="disconnected-text"
        :class="{ 'hidden-text': isSocketConnected }"
      >
        Disconnected
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { reactive, computed } from "vue";
import NewGameWindow from "@/components/NewGameWindow";

export default {
  name: "TopBar",
  components: {
    NewGameWindow,
  },
  setup() {
    const store = useStore();
    const state = reactive({
      socketState: WebSocket.OPEN,
    });

    const isSocketConnected = computed(
      () => state.socketState === WebSocket.OPEN
    );

    const turn = computed(() => {
      const turn = store.state.TicTacToe.myTurn;
      if (turn === null) {
        return "";
      }
      if (turn === true) {
        return `Your turn`;
      }
      if (turn === false) {
        return "Enemy's turn";
      }
      return turn;
    });

    return {
      state,
      turn,
      isSocketConnected,
    };
  },
  mounted() {
    const store = useStore();

    setInterval(() => {
      this.state.socketState = store.state.TicTacToe.socket.readyState;
    }, 1000);
  },
};
</script>

<style scoped>
.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rebeccapurple;
  color: white;
  width: 100%;
  height: 2.5em;
  position: fixed;
  top: 0px;
}

.--disconnected {
  background-color: darkred;
}

.disconnected-text {
  margin: 0 2em;
}

.hidden-text {
  color: rebeccapurple;
  -moz-user-select: none;
  -webkit-user-select: none;
}
</style>