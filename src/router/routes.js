import AuthLayout from "@/pages/Dashboard/Pages/AuthLayout.vue";
import PostLayout from "@/pages/Dashboard/Pages/PostLayout.vue";

import Post from "@/pages/Dashboard/Posts.vue";

// Post Management
import DashboardAdmin from "@/pages/Dashboard/DashboardAdmin.vue";

// Pages
import Login from "@/pages/Dashboard/Pages/Login.vue";
import Register from "@/pages/Dashboard/Pages/Register.vue";


//import middleware
import auth from "@/middleware/auth";
import guest from "@/middleware/guest";



let authPages = {
  path: "/admin",
  component: AuthLayout,
  name: "Authentication",
  children: [
    {
      path: "/admin",
      name: "Login",
      component: Login,
      meta: { middleware: guest }
    },
    {
      path: "/register",
      name: "Register",
      component: Register,
      meta: { middleware: guest }
    },
    {
      path: "/dashboard",
      name: "Home",
      components: { default: DashboardAdmin },
      meta: { middleware: auth }
    }
  ]
};


const routes = [
  {
    path: "/",
    component: PostLayout,
    meta: { middleware: guest },
    children: [
      {
        path: "/",
        name: "Dashboard",
        components: { default: Post },
        meta: { middleware: guest }
      }
    ]
  },
  authPages
];

export default routes;
