import { prisma } from "../../lib/prisma";
import { MealInput } from "./meal.interface";

const createMeal = async (userId: string, categoryId: string, mealInput: MealInput) =>{
    if( !userId || !categoryId ){
        throw new Error("User ID and Category ID are required to create a meal.");
    }

    return await prisma.$transaction(async (tx) => {
        const existingProvider = await tx.user.findUnique({
            where: { id: userId, role: 'PROVIDER' },
            select: { id: true, providerProfile: { select: { id: true } } }
        });

        if (!existingProvider || !existingProvider.providerProfile) {
            throw new Error("Provider does not exist.");
        }

        const existingCategory = await tx.category.findUnique({
            where: { id: categoryId },
            select: { id: true }
        });
        if (!existingCategory) {
            throw new Error("Category does not exist.");
        }

        const newMeal = await tx.meal.create({
            data: {
                providerId: existingProvider.providerProfile.id,
                categoryId: categoryId,
                name: mealInput.name,
                description: mealInput.description || "",
                price: mealInput.price,
                image: mealInput.image || "",
                isAvailable: mealInput.isAvailable
            }
        });

        return newMeal;
    });

}

export const MealService = {
    createMeal
}