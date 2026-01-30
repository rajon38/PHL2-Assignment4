
import { prisma } from "../../lib/prisma";

const createCategory = async (name: string) => {
    const existingCategory = await prisma.category.findUnique({
        where: { name }
    });
    if (existingCategory) {
        throw new Error("Category already exists");
    }
    return await prisma.category.create({
        data: {
            name
        }
    });

}

const getAllCategories = async () => {
    return await prisma.category.findMany();
}


const updateCategory = async ( categoryId: string, name: string ) => {
    const category = await prisma.category.findUnique({
        where: { id: categoryId }
    });
    if (!category) {
        throw new Error("Category not found");
    }
    const updatedCategory = await prisma.category.update({
        where: { id: categoryId },
        data: { name }
    });
    return updatedCategory;
}

export const CategoryService = {
    createCategory,
    getAllCategories,
    updateCategory
}