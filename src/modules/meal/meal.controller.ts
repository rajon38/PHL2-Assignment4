import { Request, Response } from "express";
import { MealService } from "./meal.service";

const createMeal = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { categoryId, mealInput } = req.body;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const newMeal = await MealService.createMeal(userId, categoryId, mealInput);
        return res.status(201).json(newMeal);
    } catch (error) {
        return res.status(400).json({ message: (error as Error).message });
    }
};

export const MealController = {
    createMeal
};