import { createRouter, createWebHashHistory } from 'vue-router'
import AuthPage from '../views/auth/Index.vue'
import AdminLayout from '../components/layout/AdminLayout.vue'
import DashboardPage from '../views/dashboard/Index.vue'
import ProfilePage from '../views/profile/Index.vue'
import ProjectsPage from '../views/projects/Index.vue'
import ResultsPage from '../views/results/Index.vue'
import ReportsPage from '../views/reports/Index.vue'
import SettingsPage from '../views/settings/Index.vue'
import MessagesPage from '../views/messages/Index.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/auth',
    },
    {
      path: '/auth',
      name: 'auth',
      component: AuthPage,
    },
    {
      path: '/',
      component: AdminLayout,
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: DashboardPage,
          meta: {
            title: '数据看板',
            activeMenu: 'dashboard',
          },
        },
        {
          path: 'profile',
          name: 'profile',
          component: ProfilePage,
          meta: {
            title: '个人中心',
            activeMenu: 'settings',
          },
        },
        {
          path: 'projects',
          name: 'projects',
          component: ProjectsPage,
          meta: {
            title: '项目管理',
            activeMenu: 'projects',
          },
        },
        {
          path: 'results',
          name: 'results',
          component: ResultsPage,
          meta: {
            title: '成果管理',
            activeMenu: 'results',
          },
        },
        {
          path: 'reports',
          name: 'reports',
          component: ReportsPage,
          meta: {
            title: '统计报表',
            activeMenu: 'reports',
          },
        },
        {
          path: 'settings',
          name: 'settings',
          component: SettingsPage,
          meta: {
            title: '系统设置',
            activeMenu: 'settings',
          },
        },
        {
          path: 'messages',
          name: 'messages',
          component: MessagesPage,
          meta: {
            title: '系统消息',
            activeMenu: 'messages',
          },
        },
      ],
    },
  ],
})

export default router
