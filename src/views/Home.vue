<template>
  <div class="home">
    <TopBar class="top-bar" />
    <TicTacToeBoard :size="state.size" />
  </div>
</template>

<script>
import { useStore } from "vuex";
import { reactive, watch } from "vue";
import TopBar from "@/components/TopBar";
import TicTacToeBoard from "@/components/TicTacToeBoard";

export default {
  name: "Home",
  components: {
    TopBar,
    TicTacToeBoard,
  },
  setup() {
    const store = useStore();

    const state = reactive({
      size: store.state.TicTacToe.size,
    });

    watch(
      () => store.state.TicTacToe.size,
      (size) => {
        state.size = size;
      }
    );
    return {
      state,
    };
  },
};
</script>

<style scoped>
.home {
  height: 90%;
  width: 100%;
}
</style>