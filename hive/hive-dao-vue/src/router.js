import { createRouter, createWebHistory } from "vue-router";
import { i18n } from "@/utils/plugins/i18n.js";
import ProposalsPage from "@/pages/Proposals/ProposalsPage.vue";
import items from "@/shared/constants/localStorage";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: () => import("@/pages/Home/HomePage.vue")
    },
    {
      path: "/faq",
      name: "FAQ",
      component: () => import("@/pages/FAQ/FAQPage.vue")
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("@/pages/Login/LoginPage.vue")
    },
    {
      path: "/proposal/:id",
      name: "ProposalVote",
      props: true,
      component: () => import("@/pages/Vote/VotePage.vue")
    },
    {
      path: "/proposals",
      component: () => import("@/components/DashboardSection.vue"),
      children: [
        {
          path: "",        // Vue 3: use "" instead of "/" for default child route
          name: "Proposals",
          component: ProposalsPage
        },
        {
          path: "workers",
          component: () => import("@/pages/Workers/WorkersPage.vue")
        },
        {
          path: "createproposal",
          component: () => import("@/pages/CreateProposal/CreateProposalPage.vue")
        }
      ]
    },
    {
      path: "/proposals/:worker",
      name: "WorkerProposalsPage",
      props: true,
      component: () => import("@/pages/WorkerProposals/WorkerProposalsPage.vue")
    },
    {
      path: "/:pathMatch(.*)*",   // Vue 3: replaces path: "*"
      name: "NotFound",
      component: () => import("@/pages/PageNotFound/PageNotFound.vue")
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (localStorage.getItem(items.LANGUAGE) !== i18n.global.locale.value) {
    i18n.global.locale.value = localStorage.getItem(items.LANGUAGE);
  }
  next();
});

export default router;