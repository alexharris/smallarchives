import firebase from 'firebase';
import Vue from "vue";
import Router from "vue-router";

import Admin from "@/views/Admin.vue";
import Login from "@/views/Login.vue";
import NotFound from "@/views/NotFound.vue";


// User
import UserSignUp from "@/views/UserSignUp.vue";
import UserProfile from "@/views/UserProfile.vue";
import UserDirectory from "@/views/UserDirectory.vue";
import EditUserProfile from "@/views/EditUserProfile.vue";

// Admin
import AdminListArchives from '@/views/AdminListArchives'
import AdminShowArchive from '@/views/AdminShowArchive'
import AdminCreateArchive from '@/views/AdminCreateArchive'
import AdminEditArchive from '@/views/AdminEditArchive'


import AdminCreateAsset from '@/views/AdminCreateAsset'
import AdminEditAsset from '@/views/AdminEditAsset'

import PublicHome from '@/views/PublicHome'
import PublicProfile from '@/views/PublicProfile'
import PublicArchive from '@/views/PublicArchive'
import PublicAsset from '@/views/PublicAsset'
import PublicAbout from '@/views/PublicAbout'

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
          name: 'AdminListArchives',
          component: AdminListArchives
        },
        {
          path: '/admin/show-archive/:archive_id',
          name: 'AdminShowArchive',
          component: AdminShowArchive
        }, 
        {
          path: '/admin/add-asset/:archive_id',
          name: 'AdminCreateAsset',
          component: AdminCreateAsset
        },         
        {
          path: '/admin/add-archive',
          name: 'AdminCreateArchive',
          component: AdminCreateArchive           
        },
        {
          path: '/admin/edit-archive/:archive_id',
          name: 'AdminEditArchive',
          component: AdminEditArchive
        },
        {
          path: '/admin/edit-asset/:archive_id/:asset_id',
          name: 'AdminEditAsset',
          component: AdminEditAsset
        },        
        {
          path: "/admin/profile",
          name: "UserProfile",
          component: UserProfile
        },   
        {
          path: "/admin/edit-profile",
          name: "EditUserProfile",
          component: EditUserProfile
        },                         
      ]      
    },
    {
      path: "/about",
      name: "PublicAbout",
      component: PublicAbout
    },     
    {
      path: "/login",
      name: "login",
      component: Login
    },     
    {
      path: "/sign-up",
      name: "UserSignUp",
      component: UserSignUp
    },
    {
      path: "/users",
      name: "UserDirectory",
      component: UserDirectory
    },
    {
      path: "/u/:username",
      name: "PublicProfile",
      component: PublicProfile
    },   
    {
      path: '/u/:username/:archive_id',
      name: 'PublicArchive',
      component: PublicArchive,
    },
    {
      path: '/u/:username/:archive_id/:asset_id',
      name: 'PublicAsset',
      component: PublicAsset
    },   
    {
      path: '/',
      name: 'PublicHome',
      component: PublicHome
    },  
    {
      path: '/demo',
      redirect: '/u/demo/7YUwCoXaIpMOmEKEKjyt'
    },      
    { path: '/404', 
      component: NotFound },            
    {
      path: '*',
      redirect: '/404'
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
