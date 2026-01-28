import express, { Router } from 'express';
import auth, { UserRole } from '../../middleware/auth';
import { AuthController } from './auth.controller';

const router = express.Router();

router.get('/:id', auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.PROVIDER), AuthController.getUserById);
router.get('/', auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.PROVIDER), AuthController.getAllUsers);
router.patch('/profile', auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.PROVIDER), AuthController.updateProfile);
router.delete('/:id', auth(UserRole.ADMIN), AuthController.deleteUser);

export const AuthRouter: Router = router;