import { Request, Response } from "express";
import { MealService } from "./meal.service";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";

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

const getAllMeals = async (req: Request, res: Response) => {
    try {
        const { search } = req.query
        const searchString = typeof search === 'string' ? search : undefined
        const isAvailable = req.query.isAvailable
            ? req.query.isAvailable === 'true'
                ? true
                : req.query.isAvailable === 'false'
                    ? false
                    : undefined
            : undefined

    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(req.query)
    const result = await MealService.getAllMeals({ search: searchString, isAvailable, page, limit, skip, sortBy, sortOrder })
        res.status(200).json(result)
    }
    catch (e) {
        res.status(400).json({
            error: "Could not fetch meals",
            details: e
        })
    }
};

export const MealController = {
    createMeal,
    getAllMeals
};