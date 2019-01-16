import firebase from 'firebase';
import Vue from "vue";
import Router from "vue-router";

import Admin from "@/views/Admin.vue";

import Login from "@/views/Login.vue";
import SignUp from "@/views/SignUp.vue";
import Profile from "@/views/Profile.vue";
import EditUserProfile from "@/views/EditUserProfile.vue";

import AdminListArchives from '@/views/AdminListArchives'
import ShowArchive from '@/views/ShowArchive'
import AdminAddArchive from '@/views/AdminAddArchive'
import EditArchive from '@/views/EditArchive'
import AdminAddAsset from '@/views/AdminAddAsset'
import AdminEditAsset from '@/views/AdminEditAsset'

import PublicProfile from '@/views/PublicProfile'
import PublicArchive from '@/views/PublicArchive'
import PublicAsset from '@/views/PublicAsset'

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
          path: '/admin/show-archive/:id',
          name: 'ShowArchive',
          component: ShowArchive
        }, 
        {
          path: '/admin/add-asset/:id',
          name: 'AdminAddAsset',
          component: AdminAddAsset
        },         
        {
          path: '/admin/add-archive',
          name: 'AdminAddArchive',
          component: AdminAddArchive           
        },
        {
          path: '/admin/edit-archive/:id',
          name: 'EditArchive',
          component: EditArchive
        },
        {
          path: '/admin/edit-asset/:archive_id/:asset_id',
          name: 'AdminEditAsset',
          component: AdminEditAsset
        },        
        {
          path: "/admin/profile",
          name: "Profile",
          component: Profile
        },   
        {
          path: "/admin/edit-profile",
          name: "EditProfile",
          component: EditUserProfile
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
      path: '/u/:username/:archive_id/:asset_id',
      name: 'PublicAsset',
      component: PublicAsset
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
