import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Login',
        component: () => import('../views/auth/Login')
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('../views/auth/Register')
    },
    {
        path: '/home',
        name: 'Home',
        component: () => import('../views/Home')
    },
    {
        path: '/account',
        name: 'Account',
        component: () => import('../views/Account')
    },
    {
        path: '/profile/:id',
        name: 'Profile',
        component: () => import('../views/Profile')
    },
    {
      path: '*',
      redirect: '/'
    }
]

const router = new VueRouter({
    routes,
    mode: 'history'
})

export default router
