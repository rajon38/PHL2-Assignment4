import express, { Router } from 'express';
import auth, { UserRole } from '../../middleware/auth';
import { ReviewController } from './review.controller';

const router = express.Router();

router.post("/", auth(UserRole.CUSTOMER), ReviewController.createReview);
router.patch("/:id", auth(UserRole.CUSTOMER), ReviewController.updateReview);
router.delete("/:id", auth(UserRole.ADMIN), ReviewController.deleteReview);

export const ReviewRouter: Router = router;