import express, { Router } from 'express';
import auth, { UserRole } from '../../middleware/auth';
import { MealController } from './meal.controller';

const router = express.Router();

router.post("/", auth(UserRole.PROVIDER), MealController.createMeal);


export const MealRouter: Router = router;