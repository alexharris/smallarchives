import firebase from 'firebase';
import Vue from "vue";
import Router from "vue-router";

import Admin from "@/views/Admin.vue";

import Login from "@/views/Login.vue";
import SignUp from "@/views/SignUp.vue";
import Profile from "@/views/Profile.vue";

import Archives from '@/views/Archives'
import ShowArchive from '@/views/ShowArchive'
import AddArchive from '@/views/AddArchive'
import EditArchive from '@/views/EditArchive'

import PublicProfile from '@/views/PublicProfile'
import PublicArchive from '@/views/PublicArchive'

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/admin",
      name: "Admin",
      component: Admin,
      redirect: '/admin/archives',
      meta: {
        requiresAuth: true
      },
      children: [      
        {
          path: '/admin/archives',
          name: 'Archives',
          component: Archives
        },
        {
          path: '/admin/show-archive/:id',
          name: 'ShowArchive',
          component: ShowArchive
        }, 
        {
          path: '/admin/add-archive',
          name: 'addArchive',
          component: AddArchive           
        },
        {
          path: '/admin/edit-archive/:id',
          name: 'EditArchive',
          component: EditArchive
        },
        {
          path: "/admin/profile",
          name: "Profile",
          component: Profile
        },                  

      ]      
    },
    {
      path: "/login",
      name: "login",
      component: Login
    },     
    {
      path: "/sign-up",
      name: "SignUp",
      component: SignUp
    },
    {
      path: "/u/:username",
      name: "PublicProfile",
      component: PublicProfile
    },   
    {
      path: '/u/:username/:id',
      name: 'PublicArchive',
      component: PublicArchive
    },
    {
      path: '*',
      redirect: '/admin'
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
