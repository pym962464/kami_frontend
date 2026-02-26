import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/pages/LoginPage.vue'
import CardList from '@/pages/CardList.vue'
import GenerateCards from '@/pages/GenerateCards.vue'
import CreateProject from '@/pages/CreateProject.vue'
import DeleteProject from '@/pages/DeleteProject.vue'
import HomePage from '@/pages/HomePage.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/home' },
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
    },
    {
      path: '/home',
      // name: 'home',
      component: HomePage,
      // 配置 HomePage 的子路由
      children: [
        { path: '', name: 'home', redirect: '/home/cardList' }, // 进入 /home 默认显示卡密列表
        { path: 'cardList', name: 'cardList', component: CardList },
        { path: 'generateCards', name: 'generateCards', component: GenerateCards },
        { path: 'createProject', name: 'createProject', component: CreateProject },
        { path: 'deleteProject', name: 'deleteProject', component: DeleteProject },
      ],
    },
  ],
})
// 全局路由守卫
router.beforeEach((to, _from) => {
  const token = localStorage.getItem('token')
  if (to.path !== '/login' && !token) {
    return '/login'
  }
})

export default router
