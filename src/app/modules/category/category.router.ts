import express, { Router } from 'express';
import { CategoryController } from './category.controller';
import auth, { UserRole } from '../../middleware/auth';

const router = express.Router();

router.get('/', auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.PROVIDER), CategoryController.getAllCategories);
router.post('/', auth(UserRole.ADMIN), CategoryController.createCategory);
router.patch('/:id', auth(UserRole.ADMIN), CategoryController.updateCategory);


export const CategoryRouter: Router = router;