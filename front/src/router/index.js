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
    }
    ,
    {
        path: '/home',
        name: 'Home',
        component: () => import('../views/Home')
    }
]

const router = new VueRouter({
    routes,
    mode: 'history'
})

export default router
