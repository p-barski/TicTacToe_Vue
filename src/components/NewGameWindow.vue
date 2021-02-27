<template>
  <div
    class="new-game-window"
    @click="show"
    @keydown.esc="() => (state.visible = false)"
  >
    <button class="new-game-button" :class="{ '--disconnected': !isConnected }">
      New Game
    </button>
    <div class="modal" :class="{ modalvisible: state.visible }">
      <form class="modal-content" @submit.prevent="newGame">
        <input
          class="input"
          type="number"
          required="required"
          min="2"
          max="100"
          step="1"
          v-model="state.sizeInput"
          ref="sizeInputRef"
        />
        <button class="confirm-button">Confirm</button>
        <span class="close">&times;</span>
      </form>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { reactive, ref } from "vue";

export default {
  name: "NewGameWindow",
  props: {
    isConnected: Boolean,
  },
  setup() {
    const store = useStore();
    const state = reactive({
      visible: false,
      sizeInput: 3,
    });
    const sizeInputRef = ref(null);

    function show(e) {
      if (e.target.className === "new-game-button") {
        this.state.visible = true;
        console.log(sizeInputRef.value.value);
        setTimeout(() => sizeInputRef.value.focus(), 30);
      } else if (
        e.target.className === "close" ||
        e.target.className === "modal modalvisible"
      ) {
        this.state.visible = false;
      }
    }

    function newGame() {
      console.log(`newGame: ${state.sizeInput}`);
      store.dispatch("TicTacToe/findGame", Number(state.sizeInput));
      this.state.visible = false;
    }

    return {
      state,
      show,
      newGame,
      sizeInputRef,
    };
  },
};
</script>

<style scoped>
.new-game-button {
  border: none;
  outline: none;
  border-radius: 0;
  color: white;
  padding: 1em;
  cursor: pointer;
  background-color: rgb(54, 15, 94);
}

.new-game-button:hover {
  background-color: rgb(81, 30, 133);
}

.--disconnected {
  background-color: rgb(98, 0, 0);
}

.--disconnected:hover {
  background-color: rgb(158, 8, 8);
}

.modal {
  display: none;
  position: fixed;
  z-index: 1;
  padding-top: 2em;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
}

.modalvisible {
  display: block;
}

.modal-content {
  background-color: rgba(0, 0, 0, 0.6);
  margin: auto;
  padding: 5em;
  margin: 1em;
}

.input {
  font-size: 2em;
  border: none;
}
.confirm-button {
  font-size: 2em;
  border: none;
  background-color: lightblue;
}

.close {
  color: white;
  margin-left: 2em;
  font-size: 3em;
  font-weight: bold;
  -moz-user-select: none;
  -webkit-user-select: none;
}

.close:hover,
.close:focus {
  color: rgb(199, 199, 199);
  text-decoration: none;
  cursor: pointer;
}
</style>