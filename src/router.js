import firebase from 'firebase';
import Vue from "vue";
import Router from "vue-router";

import Admin from "@/views/Admin.vue";

import Login from "@/views/Login.vue";
import SignUp from "@/views/SignUp.vue";
import Profile from "@/views/Profile.vue";
import EditUserProfile from "@/views/EditUserProfile.vue";

import ListArchives from '@/views/ListArchives'
import ShowArchive from '@/views/ShowArchive'
import AddArchive from '@/views/AddArchive'
import EditArchive from '@/views/EditArchive'
import UploadAsset from '@/views/UploadAsset'
import EditAsset from '@/views/EditAsset'

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
          name: 'ListArchives',
          component: ListArchives
        },
        {
          path: '/admin/show-archive/:id',
          name: 'ShowArchive',
          component: ShowArchive
        }, 
        {
          path: '/admin/upload-asset/:id',
          name: 'UploadAsset',
          component: UploadAsset
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
          path: '/admin/edit-asset/:archive_id/:asset_id',
          name: 'EditAsset',
          component: EditAsset
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
