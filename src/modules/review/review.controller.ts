import { Request, Response } from "express";
import { ReviewService } from "./review.service";

const createReview = async (req: Request, res: Response) => {
    try {
        const user = req?.user as any;
        const reviewInput = req.body;

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const newReview = await ReviewService.createReview(user.id, reviewInput);
        return res.status(201).json(newReview);
    } catch (error) {
        return res.status(400).json({ message: (error as Error).message });
    }
};

const updateReview = async (req: Request, res: Response) => {
    try {
        const user = req?.user as any;
        const reviewId = req.params.id as string;
        const reviewInput = req.body;

        const updatedReview = await ReviewService.updateReview(reviewId, user.id, reviewInput);
        return res.status(200).json(updatedReview);
    } catch (error) {
        return res.status(400).json({ message: (error as Error).message });
    }
};

const deleteReview = async (req: Request, res: Response) => {
    try {
        const reviewId = req.params.id as string;

        await ReviewService.deleteReview(reviewId);
        return res.status(204).send();
    } catch (error) {
        return res.status(400).json({ message: (error as Error).message });
    }
};

export const ReviewController = {
    createReview,
    updateReview,
    deleteReview
}