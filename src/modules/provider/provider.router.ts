import express, { Router } from 'express';
import auth, { UserRole } from '../../middleware/auth';
import { ProviderController } from './provider.controller';

const router = express.Router();

router.get('/:id', ProviderController.getProviderById);
router.get('/', ProviderController.getAllProviders);
router.post('/', auth(UserRole.PROVIDER), ProviderController.createProvider)
router.patch('/:id', auth(UserRole.ADMIN, UserRole.PROVIDER), ProviderController.updateProvider);

export const ProviderRouter: Router = router;