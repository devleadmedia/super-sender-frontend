import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('pages/login/LoginPage.vue'),
  },
  {
    path: '/app',
    redirect: '/app/home',
    component: () => import('layouts/main/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('pages/IndexPage.vue'),
        meta: { requiresAuth: true, roles: [] },
      },
      {
        path: 'user',
        name: 'user',
        component: () => import('pages/user/UserPage.vue'),
        meta: { requiresAuth: true, roles: [] },
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => import('pages/profile/ProfilePage.vue'),
        meta: { requiresAuth: true, roles: [] },
      },
      {
        path: 'tablePrice',
        name: 'tablePrice',
        component: () => import('pages/price/table/TablePrice.vue'),
        meta: { requiresAuth: true, roles: [] },
      },
      {
        path: 'priceManagement',
        name: 'priceManagement',
        component: () => import('src/pages/price/management/PriceManagement.vue'),
        meta: { requiresAuth: true, roles: [] },
      },
      {
        path: 'statement',
        name: 'statement',
        component: () => import('src/pages/statement/StatementPage.vue'),
        meta: { requiresAuth: true, roles: [] },
      }, 
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
