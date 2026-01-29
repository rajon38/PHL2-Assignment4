import { Request, Response } from "express";
import { MealService } from "./meal.service";
import paginationSortingHelper from "../../../helpers/paginationSortingHelper";

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

const getOneMeal = async (req: Request, res: Response) => {
    try {
        const mealId = req.params.id as string;
        const meal = await MealService.getOneMeal(mealId);
        if (!meal) {
            return res.status(404).json({ message: "Meal not found" });
        }
        return res.status(200).json(meal);
    } catch (error) {
        return res.status(400).json({ message: (error as Error).message });
    }
};

const updateMeal = async (req: Request, res: Response) => {
    try {
        const mealId = req.params.id as string;
        const mealInput = req.body;

        const updatedMeal = await MealService.updateMeal(mealId, mealInput);
        return res.status(200).json(updatedMeal);
    } catch (error) {
        return res.status(400).json({ message: (error as Error).message });
    }
};

const deleteMeal = async (req: Request, res: Response) => {
    try {
        const mealId = req.params.id as string;

        await MealService.deleteMeal(mealId);
        return res.status(204).send();
    } catch (error) {
        return res.status(400).json({ message: (error as Error).message });
    }
};

export const MealController = {
    createMeal,
    getAllMeals,
    getOneMeal,
    updateMeal,
    deleteMeal
};