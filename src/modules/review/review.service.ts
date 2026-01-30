import { prisma } from "../../lib/prisma";
import { ReviewInput, ReviewValidator } from "./review.interface";

const createReview = async(userId: string, reviewInput: ReviewInput)=>{
    if(!userId  || !reviewInput.mealId){
        throw new Error("User ID and Meal ID are required to create a review");
    }
    return await prisma.$transaction(async(tx)=>{
        const existingUser = await tx.user.findUnique({
            where: {id: userId},
            select: {id: true}
        });
        if(!existingUser){
            throw new Error("User does not exist");
        }
        const existingMeal =  await tx.meal.findUnique({
            where: {id: reviewInput.mealId},
            select: {id: true}
        });
        if(!existingMeal){
            throw new Error("Meal does not exist");
        }

        if (!ReviewValidator.isValidRating(reviewInput.rating)) {
            throw new Error("Invalid rating. Rating should be between 1 and 5.");
        }
        const newReview = await tx.review.create({
            data: {
                mealId: reviewInput.mealId,
                customerId: existingUser.id,
                rating: reviewInput.rating,
                comment: reviewInput.comment || ""
            }
        });
        return newReview;
    });
}

const updateReview = async( reviewId: string, userId: string, reviewInput: Partial<ReviewInput> )=>{
    if (!reviewId) {
        throw new Error("Review ID is required to update a review");
    }

    return await prisma.$transaction(async (tx) => {
        const existingReview = await tx.review.findUnique({
            where: { id: reviewId },
        });

        if (!existingReview) {
            throw new Error("Review does not exist");
        }

        if (existingReview.customerId !== userId) {
            throw new Error("You are not authorized to update this review");
        }

        if (reviewInput.rating !== undefined && !ReviewValidator.isValidRating(reviewInput.rating)) {
            throw new Error("Invalid rating. Rating should be between 1 and 5.");
        }

        const updatedReview = await tx.review.update({
            where: { id: reviewId },
            data: {
                rating: reviewInput.rating ?? existingReview.rating,
                comment: reviewInput.comment ?? existingReview.comment,
            },
        });

        return updatedReview;
    });
}

const deleteReview = async( reviewId: string )=>{
    if (!reviewId) {
        throw new Error("Review ID is required to delete a review");
    }

    return await prisma.$transaction(async (tx) => {
        const existingReview = await tx.review.findUnique({
            where: { id: reviewId },
        });

        if (!existingReview) {
            throw new Error("Review does not exist");
        }

        await tx.review.delete({
            where: { id: reviewId },
        });

        return { message: "Review deleted successfully" };
    });
}

export const ReviewService = {
    createReview,
    updateReview,
    deleteReview
}