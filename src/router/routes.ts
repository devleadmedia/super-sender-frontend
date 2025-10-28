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
        component: () =>
          import('src/pages/price/management/PriceManagement.vue'),
        meta: { requiresAuth: true, roles: [] },
      },
      {
        path: 'statement',
        name: 'statement',
        component: () => import('src/pages/statement/StatementPage.vue'),
        meta: { requiresAuth: true, roles: [] },
      },
      {
        path: 'senderByClient',
        name: 'senderByClient',
        component: () =>
          import('src/pages/sender/sender-by-client/SenderByClient.vue'),
        meta: { requiresAuth: true, roles: [] },
      },
      {
        path: 'senderManagement',
        name: 'senderManagement',
        component: () =>
          import('src/pages/sender/management/SenderManagement.vue'),
        meta: { requiresAuth: true, roles: [] },
      },
      {
        path: 'buyCredit',
        name: 'buyCredit',
        component: () => import('src/pages/buy-credit/BuyCredit.vue'),
        meta: { requiresAuth: true, roles: [] },
      },
      {
        path: 'messageSMS',
        name: 'messageSMS',
        component: () => import('src/pages/sms/message/MessageSMS.vue'),
        meta: { requiresAuth: true, roles: [] },
      },
      {
        path: 'contactSMS',
        name: 'contactSMS',
        component: () => import('src/pages/sms/contact/ContactSMS.vue'),
        meta: { requiresAuth: true, roles: [] },
      },
      {
        path: 'shootingSMS',
        name: 'shootingSMS',
        component: () => import('src/pages/sms/shooting/ShootingSMS.vue'),
        meta: { requiresAuth: true, roles: [] },
      },
      {
        path: 'chatSMS',
        name: 'chatSMS',
        component: () => import('src/pages/sms/chat/ChatSMS.vue'),
        meta: { requiresAuth: true, roles: [] },
      },
      {
        path: 'messageWhatsapp',
        name: 'messageWhatsapp',
        component: () =>
          import('src/pages/whatsapp/message/MessageWhatsapp.vue'),
        meta: { requiresAuth: true, roles: [] },
      },
      {
        path: 'contactWhatsapp',
        name: 'contactWhatsapp',
        component: () =>
          import('src/pages/whatsapp/contact/ContactWhatsapp.vue'),
        meta: { requiresAuth: true, roles: [] },
      },
      {
        path: 'shootingWhatsapp',
        name: 'shootingWhatsapp',
        component: () => import('src/pages/sms/shooting/ShootingSMS.vue'),
        meta: { requiresAuth: true, roles: [] },
      },
      {
        path: 'chatWhatsapp',
        name: 'chatWhatsapp',
        component: () => import('src/pages/sms/chat/ChatSMS.vue'),
        meta: { requiresAuth: true, roles: [] },
      },
      {
        path: 'campaign',
        name: 'campaign',
        component: () => import('src/pages/campaign/CampaignPage.vue'),
        meta: { requiresAuth: true, roles: [] },
      },
      {
        path: 'support',
        name: 'support',
        component: () => import('src/pages/support/SupportPage.vue'),
        meta: { requiresAuth: true, roles: [] },
      },
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
