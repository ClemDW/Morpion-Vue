import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Profile from '../views/Profile.vue'
import Game from '../views/Game.vue'
import Join from '../views/Join.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
    },
    {
      path: '/game/:id',
      name: 'game',
      component: Game,
    },
    {
      path: "/join",
      name: "join",
      component: Join
    },
  ],
});

router.beforeEach((to, from, next) => {
  const userId = sessionStorage.getItem("user_id");
  const userName = sessionStorage.getItem("user_name");
  if ((!userId || !userName) && to.path !== "/profile") {
    next("/profile");
  } else {
    next();
  }
});


export default router
