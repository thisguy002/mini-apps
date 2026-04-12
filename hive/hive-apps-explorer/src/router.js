import { createRouter, createWebHistory } from 'vue-router'  // ← replaces Vue 2 imports
import Home from './views/Home.vue'

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/trx',
      name: 'trx',
      component: () => import('./views/Transactions.vue')
    },
    {
      path: '/trx/:trxId',
      name: 'trxItem',
      props: true,
      component: () => import('./views/TransactionItem.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: () => import('./views/PageNotFound.vue')
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    return { top: 0 } 
  }
})