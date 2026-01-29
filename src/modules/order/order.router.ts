import express, { Router } from 'express';
import auth, { UserRole } from '../../middleware/auth';
import { OrderController } from './order.controller';

const router = express.Router();

router.get("/", auth(UserRole.ADMIN, UserRole.PROVIDER, UserRole.CUSTOMER), OrderController.getAllOrders);
router.post("/", auth(UserRole.CUSTOMER), OrderController.createOrder);
router.patch("/:id", auth(UserRole.CUSTOMER), OrderController.updateOrderById);
router.patch("/status/:id", auth(UserRole.ADMIN, UserRole.PROVIDER), OrderController.orderStatusUpdate);
router.delete("/:id", auth(UserRole.ADMIN), OrderController.deleteOrder);


export const OrderRouter: Router = router;