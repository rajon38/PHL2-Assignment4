import { Request, Response } from "express";
import { CategoryService } from "./category.service";

const createCategory = async (req: Request, res: Response) => {
    const { name } = req.body;
    if(!name) {
        return res.status(400).json({ message: "Category name is required" });
    }
    try {
        const category = await CategoryService.createCategory(name);
        return res.status(201).json(category);
    } catch (error) {
        return res.status(400).json({ message: (error as Error).message });
    }
}

const getAllCategories = async (req: Request, res: Response) => {
    try {
        const categories = await CategoryService.getAllCategories();
        return res.status(200).json(categories);
    } catch (error) {
        return res.status(400).json({ message: (error as Error).message });
    }
}

const updateCategory = async (req: Request, res: Response) => {
    const categoryId = req.params.id as string;
    const { name } = req.body;
    if(!name) {
        return res.status(400).json({ message: "Category name is required" });
    }
    try {
        const updatedCategory = await CategoryService.updateCategory(categoryId, name);
        return res.status(200).json(updatedCategory);
    } catch (error) {
        return res.status(400).json({ message: (error as Error).message });
    }
}

export const CategoryController = {
    createCategory,
    getAllCategories,
    updateCategory
}