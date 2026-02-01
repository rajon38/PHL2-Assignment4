import express, { Router } from 'express';
import { CategoryController } from './category.controller';
import auth, { UserRole } from '../../middleware/auth';

const router = express.Router();

router.get('/', CategoryController.getAllCategories);
router.post('/', auth(UserRole.ADMIN), CategoryController.createCategory);
router.patch('/:id', auth(UserRole.ADMIN), CategoryController.updateCategory);


export const CategoryRouter: Router = router;