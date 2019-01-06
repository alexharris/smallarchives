import firebase from 'firebase';
import Vue from "vue";
import Router from "vue-router";

import Home from "@/views/Home.vue";
import Login from "@/views/Login.vue";
import SignUp from "@/views/SignUp.vue";
import Profile from "@/views/Profile.vue";

import ArchiveList from '@/components/ArchiveList'
import ShowArchive from '@/components/ShowArchive'
import AddArchive from '@/components/AddArchive'
import EditArchive from '@/components/EditArchive'

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: '*',
      redirect: '/login'
    },
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: "/login",
      name: "login",
      component: Login
    },     
    {
      path: "/home",
      name: "Home",
      component: Home,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/profile",
      name: "Profile",
      component: Profile,
      meta: {
        requiresAuth: true
      }
    },    
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue")
    }, 
    {
      path: "/sign-up",
      name: "SignUp",
      component: SignUp
    },
    {
      path: '/archives',
      name: 'ArchiveList',
      component: ArchiveList,
      meta: {
        requiresAuth: true
      }      
    },    
    {
      path: '/show-archive/:id',
      name: 'ShowArchive',
      component: ShowArchive
    },
    {
      path: '/add-archive',
      name: 'addArchive',
      component: AddArchive,
      meta: {
        requiresAuth: true
      }        
    },
    {
      path: '/edit-archive/:id',
      name: 'EditArchive',
      component: EditArchive
    }
  ]
});

router.beforeEach((to, from, next) => {
  const currentUser = firebase.auth().currentUser;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !currentUser) next('login');
  // else if (!requiresAuth && currentUser) next('list');
  else next();
});

export default router;
