import express from "express";
import { CategoryRouter } from "../modules/category/category.router";
import { ProviderRouter } from "../modules/provider/provider.router";
import { AuthRouter } from "../modules/auth/auth.router";


const router = express.Router();

const moduleRoutes = [
  {
    path: "/users",
    route: AuthRouter,
  },
  {
    path: "/categories",
    route: CategoryRouter,
  },
  {
    path: "/providers",
    route: ProviderRouter,
  },

];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
