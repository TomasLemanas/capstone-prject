import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '../views/home/HomePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/home' }, // Redirect from root to the homepage
    { path: '/home', component: HomePage },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/home/HomePage.vue')
    },
    {
      path: '/history',
      name: 'history',
      component: () => import('../views/history/HistoryPage.vue')
    },
    {
      path: '/three-card-deck',
      name: 'Three Card Deck',
      component: () => import('../views/three-card-deck/ThreeCardDeck.vue')
    },
    {
      path: '/card-of-the-day',
      name: 'Card Of The Day',
      component: () => import('../views/card-of-the-day/CardOfTheDay.vue')
    }
  ]
})

export default router
