import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout/Layout.vue'

const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '仪表盘', icon: 'Odometer' }
      }
    ]
  },
  {
    path: '/server',
    component: Layout,
    redirect: '/server/list',
    meta: { title: '服务器管理', icon: 'Monitor' },
    children: [
      {
        path: 'list',
        name: 'ServerList',
        component: () => import('@/views/server/list.vue'),
        meta: { title: '服务器列表', icon: 'List' }
      },
      {
        path: 'monitor',
        name: 'ServerMonitor',
        component: () => import('@/views/server/monitor.vue'),
        meta: { title: '服务器监控', icon: 'DataLine' }
      }
    ]
  },
  {
    path: '/k8s',
    component: Layout,
    redirect: '/k8s/cluster',
    meta: { title: 'Kubernetes', icon: 'Cloudy' },
    children: [
      {
        path: 'cluster',
        name: 'K8sCluster',
        component: () => import('@/views/k8s/cluster.vue'),
        meta: { title: '集群管理', icon: 'Grid' }
      },
      {
        path: 'deployment',
        name: 'K8sDeployment',
        component: () => import('@/views/k8s/deployment.vue'),
        meta: { title: 'Deployment', icon: 'Box' }
      },
      {
        path: 'pod',
        name: 'K8sPod',
        component: () => import('@/views/k8s/pod.vue'),
        meta: { title: 'Pod', icon: 'Coin' }
      },
      {
        path: 'service',
        name: 'K8sService',
        component: () => import('@/views/k8s/service.vue'),
        meta: { title: 'Service', icon: 'Connection' }
      }
    ]
  },
  {
    path: '/database',
    component: Layout,
    redirect: '/database/mysql',
    meta: { title: '数据库管理', icon: 'Coin' },
    children: [
      {
        path: 'mysql',
        name: 'MySQL',
        component: () => import('@/views/database/mysql.vue'),
        meta: { title: 'MySQL', icon: 'Coin' }
      },
      {
        path: 'redis',
        name: 'Redis',
        component: () => import('@/views/database/redis.vue'),
        meta: { title: 'Redis', icon: 'Coin' }
      }
    ]
  },
  {
    path: '/deploy',
    component: Layout,
    redirect: '/deploy/project',
    meta: { title: '部署管理', icon: 'Upload' },
    children: [
      {
        path: 'project',
        name: 'DeployProject',
        component: () => import('@/views/deploy/project.vue'),
        meta: { title: '项目部署', icon: 'Folder' }
      },
      {
        path: 'history',
        name: 'DeployHistory',
        component: () => import('@/views/deploy/history.vue'),
        meta: { title: '部署记录', icon: 'Document' }
      }
    ]
  },
  {
    path: '/monitor',
    component: Layout,
    redirect: '/monitor/alert',
    meta: { title: '监控告警', icon: 'Bell' },
    children: [
      {
        path: 'alert',
        name: 'MonitorAlert',
        component: () => import('@/views/monitor/alert.vue'),
        meta: { title: '告警管理', icon: 'Warning' }
      },
      {
        path: 'log',
        name: 'MonitorLog',
        component: () => import('@/views/monitor/log.vue'),
        meta: { title: '日志管理', icon: 'Tickets' }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    redirect: '/system/user',
    meta: { title: '系统管理', icon: 'Setting' },
    children: [
      {
        path: 'user',
        name: 'SystemUser',
        component: () => import('@/views/system/user.vue'),
        meta: { title: '用户管理', icon: 'User' }
      },
      {
        path: 'role',
        name: 'SystemRole',
        component: () => import('@/views/system/role.vue'),
        meta: { title: '角色管理', icon: 'UserFilled' }
      },
      {
        path: 'menu',
        name: 'SystemMenu',
        component: () => import('@/views/system/menu.vue'),
        meta: { title: '菜单管理', icon: 'Menu' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
