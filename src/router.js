import firebase from "firebase/app";
import "firebase/firestore";
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
import AdminDashboard from "@/views/AdminDashboard";
import AdminShowArchive from "@/views/AdminShowArchive";
import AdminCreateArchive from "@/views/AdminCreateArchive";
import AdminEditArchive from "@/views/AdminEditArchive";
import AdminPaymentSignup from "@/views/AdminPaymentSignup";
// import AdminCreateItem from "@/views/AdminCreateItem";
import AdminEditItem from "@/views/AdminEditItem";

// Public
import PromoSignUp from "@/views/PromoSignUp.vue";
import PromoLogin from "@/views/PromoLogin.vue";
import PromoHome from "@/views/PromoHome";
import PromoProfile from "@/views/PromoProfile";
import PublicArchive from "@/views/PublicArchive";
import PublicArchiveAbout from "@/views/PublicArchiveAbout";
import PublicItem from "@/views/PublicItem";
import PromoAbout from "@/views/PromoAbout";
import PromoSchema from "@/views/PromoSchema";

import PromoSuccess from "@/views/PromoSuccess";
import PromoCancelled from "@/views/PromoCancelled";

import Test from "@/views/Test";

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
      redirect: "/admin/dashboard",
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: "/admin/dashboard",
          name: "AdminDashboard",
          component: AdminDashboard
        },
        {
          path: "/admin/show-archive/:archive_id",
          name: "AdminShowArchive",
          component: AdminShowArchive
        },
        // {
        //   path: "/admin/add-item/:archive_id",
        //   name: "AdminCreateItem",
        //   component: AdminEditItem
        // },
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
          path: "/admin/edit-item/:archive_id/",
          name: "AdminEditNewItem",
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
      path: "/u/:username/:archive_id/about",
      name: "PublicArchiveAbout",
      component: PublicArchiveAbout
    },
    {
      path: "/payment",
      name: "AdminPaymentSignup",
      component: AdminPaymentSignup
    },
    {
      path: "/success",
      name: "PromoSuccess",
      component: PromoSuccess
    },
    {
      path: "/cancelled",
      name: "PromoCancelled",
      component: PromoCancelled
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
      path: "/test",
      name: "Test",
      component: Test
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
