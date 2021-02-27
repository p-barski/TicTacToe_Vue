<template>
  <div class="board" :style="columnStyle">
    <template v-for="y in range(0, size)" :key="y">
      <template v-for="x in range(0, size)" :key="x">
        <button class="grid-item" @click="() => buttonClick(x, y)">
          {{ boardArray[x][y] }}
        </button>
      </template>
    </template>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";

export default {
  name: "TicTacToeBoard",
  props: {
    size: Number,
  },
  setup(props) {
    const store = useStore();
    function range(start, stop) {
      return new Array(stop - start).fill(start).map((n, i) => n + i);
    }
    const columnStyle = computed(
      () => `grid-template-columns:${" auto".repeat(props.size)};`
    );

    const buttonClick = function (x, y) {
      store.dispatch("TicTacToe/makeMove", { x: x, y: y });
    };

    const boardArray = computed(() => {
      return store.state.TicTacToe.board;
    });

    return {
      range,
      columnStyle,
      boardArray,
      buttonClick,
    };
  },
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}
.board {
  display: grid;
  width: 100%;
  height: 100%;
  margin-top: 2.5em;
}
.grid-item {
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1e1e1e;
  border: 2px groove #2a3b4c;
  color: white;
  min-width: 8em;
  min-height: 8em;
  width: 100%;
  height: 100%;
  -webkit-user-select: none;
  -moz-user-select: none;
  cursor: pointer;
}

.grid-item:hover {
  background-color: #2a3b4c;
}
</style>