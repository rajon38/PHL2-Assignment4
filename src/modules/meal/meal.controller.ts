import { Request, Response } from "express";
import { MealService } from "./meal.service";

const createMeal = async (req: Request, res: Response) => {
    try {
        const user = req?.user as any;
        const mealInput = req.body;

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const newMeal = await MealService.createMeal(user.id, mealInput);
        return res.status(201).json(newMeal);
    } catch (error) {
        return res.status(400).json({ message: (error as Error).message });
    }
};

export const MealController = {
    createMeal
};