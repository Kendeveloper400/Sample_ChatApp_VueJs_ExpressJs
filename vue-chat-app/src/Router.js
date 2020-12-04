import Login from "./components/Login";
import Home from "./components/Home";
import VueRouter from 'vue-router';

export default new VueRouter({
    mode: 'history',
    base: __dirname,
    routes: [
      { path: '/', component: Login },
      { path: '/home', component: Home },
    ]
  });