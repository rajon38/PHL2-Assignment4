import express, { Router } from 'express';
import auth, { UserRole } from '../../middleware/auth';
import { MealController } from './meal.controller';

const router = express.Router();

router.get("/", auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.PROVIDER), MealController.getAllMeals);
router.get("/:id", auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.PROVIDER), MealController.getOneMeal);
router.post("/", auth(UserRole.PROVIDER), MealController.createMeal);
router.patch("/:id", auth(UserRole.PROVIDER), MealController.updateMeal);


export const MealRouter: Router = router;