import firebase from 'firebase/app';
import 'firebase/firestore';
import Vue from "vue";
import Router from "vue-router";

import Admin from "@/views/Admin.vue";

import NotFound from "@/views/NotFound.vue";

// User

import UserProfile from "@/views/UserProfile.vue";
import UserDirectory from "@/views/UserDirectory.vue";
import EditUserProfile from "@/views/EditUserProfile.vue";

// Admin
import AdminAccountInfo from "@/views/AdminAccountInfo";
import AdminListArchives from "@/views/AdminListArchives";
import AdminShowArchive from "@/views/AdminShowArchive";
import AdminCreateArchive from "@/views/AdminCreateArchive";
import AdminEditArchive from "@/views/AdminEditArchive";

import AdminCreateItem from "@/views/AdminCreateItem";
import AdminEditItem from "@/views/AdminEditItem";

// Public
import PromoSignUp from "@/views/PromoSignUp.vue";
import PromoLogin from "@/views/PromoLogin.vue";
import PromoHome from "@/views/PromoHome";
import PromoProfile from "@/views/PromoProfile";
import PublicArchive from "@/views/PublicArchive";
import PublicItem from "@/views/PublicItem";
import PromoAbout from "@/views/PromoAbout";
import PromoSchema from "@/views/PromoSchema";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "PromoHome",
      component: PromoHome
    },
    {
      path: "/admin",
      name: "Admin",
      component: Admin,
      redirect: "/admin/archives",
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: "/admin/archives",
          name: "AdminListArchives",
          component: AdminListArchives
        },
        {
          path: "/admin/show-archive/:archive_id",
          name: "AdminShowArchive",
          component: AdminShowArchive
        },
        {
          path: "/admin/add-item/:archive_id",
          name: "AdminCreateItem",
          component: AdminEditItem
        },
        {
          path: "/admin/add-archive",
          name: "AdminCreateArchive",
          component: AdminCreateArchive
        },
        {
          path: "/admin/edit-archive/:archive_id",
          name: "AdminEditArchive",
          component: AdminEditArchive
        },
        {
          path: "/admin/edit-item/:archive_id/:item_id",
          name: "AdminEditItem",
          component: AdminEditItem
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
        {
          path: "/admin/account",
          name: "AdminAccountInfo",
          component: AdminAccountInfo
        }
      ]
    },
    {
      path: "/about",
      name: "PromoAbout",
      component: PromoAbout
    },
    {
      path: "/schema",
      name: "PromoSchema",
      component: PromoSchema
    },
    {
      path: "/login",
      name: "PromoLogin",
      component: PromoLogin
    },
    {
      path: "/sign-up",
      name: "PromoSignUp",
      component: PromoSignUp
    },
    {
      path: "/users",
      name: "UserDirectory",
      component: UserDirectory
    },
    {
      path: "/u/:username",
      name: "PromoProfile",
      component: PromoProfile
    },
    {
      path: "/u/:username/:archive_id",
      name: "PublicArchive",
      component: PublicArchive
    },
    {
      path: "/u/:username/:archive_id/:item_id",
      name: "PublicItem",
      component: PublicItem
    },
    {
      path: "/demo",
      redirect: "/u/demo/7YUwCoXaIpMOmEKEKjyt"
    },
    {
      path: "/404",
      component: NotFound
    },
    {
      path: "*",
      redirect: "/404"
    }
  ]
});

router.beforeEach((to, from, next) => {
  const currentUser = firebase.auth().currentUser;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !currentUser) next("login");
  // else if (!requiresAuth && currentUser) next('list');
  else next();
});

export default router;
