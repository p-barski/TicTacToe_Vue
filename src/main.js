import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'

createApp(App).use(router).use(store).mount('#app');

store.dispatch("TicTacToe/connectToServer");

setInterval(() => {
  if (store.state.TicTacToe.socket && store.state.TicTacToe.socket.readyState !== WebSocket.CLOSED) {
    return;
  }
  store.dispatch("TicTacToe/connectToServer");
}, 1000)