import { MealWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { MealInput } from "./meal.interface";

const createMeal = async (userId: string, mealInput: MealInput) =>{
    if( !userId || !mealInput.categoryId ){
        throw new Error("User ID and Category ID are required to create a meal.");
    }

    return await prisma.$transaction(async (tx) => {
        const existingProvider = await tx.user.findUnique({
            where: { id: userId },
            select: { id: true, providerProfile: { select: { id: true } } }
        });

        if (!existingProvider || !existingProvider.providerProfile) {
            throw new Error("Provider does not exist.");
        }

        const existingCategory = await tx.category.findUnique({
            where: { id: mealInput.categoryId },
            select: { id: true }
        });
        if (!existingCategory) {
            throw new Error("Category does not exist.");
        }

        const newMeal = await tx.meal.create({
            data: {
                providerId: existingProvider.providerProfile.id,
                categoryId: mealInput.categoryId,
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

const getAllMeals = async ({search, isAvailable, page, limit, skip, sortBy, sortOrder}: 
    {search: string | undefined, isAvailable: boolean | undefined, page: number, limit: number, skip: number, sortBy: string, sortOrder: string}) => {

    const andConditions: MealWhereInput[] = [];
    
    if (search) {
        andConditions.push({
            OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ]
        });
    }

    if (typeof isAvailable === "boolean") {
        andConditions.push({ isAvailable });
    }


    const data = await prisma.meal.findMany({
        take: limit,
        skip,
        where: {
            AND: andConditions
        },
        orderBy: {
            [sortBy]: sortOrder
        },
        select: { 
            id: true,
            name: true,
            description: true,
            price: true,
            image: true,
            isAvailable: true,
            category: {
                select: {
                    id: true,
                    name: true
                }
            },
            provider: {
                select: {
                    id: true,
                    restaurantName: true
                }
            }
        }
    });

    const total = await prisma.meal.count({
        where: {
            AND: andConditions
        }
    });

    return {
        data,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
}

const getOneMeal = async (mealId: string) => {
    if (!mealId) {
        throw new Error("Meal ID is required to get a meal");
    }
    return await prisma.$transaction(async (tx) => {
        await tx.meal.update({
            where: {
                id: mealId
            },
            data: {
                views: {
                    increment: 1
                }
            }
        })

        const meal = await tx.meal.findUnique({
            where: { id: mealId },
            select: { 
                id: true,
                name: true,
                description: true,
                price: true,
                image: true,
                isAvailable: true,
                views: true,
                category: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                provider: {
                    select: {
                        id: true,
                        restaurantName: true
                    }
                },
                reviews: {
                    select: {
                        id: true,
                        rating: true,
                        comment: true,
                        createdAt: true,
                        customer: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            }
        });

        return meal;
    });
}

const updateMeal = async ( mealId: string, mealInput: Partial<MealInput> ) => {
    if (!mealId) {
        throw new Error("Meal ID is required to update a meal");
    }

    return await prisma.$transaction(async (tx) => {
        const existingMeal = await tx.meal.findUnique({
            where: { id: mealId },
        });

        if (!existingMeal) {
            throw new Error("Meal does not exist");
        }

        const updatedMeal = await tx.meal.update({
            where: { id: mealId },
            data: {
                name: mealInput.name ?? existingMeal.name,
                description: mealInput.description ?? existingMeal.description,
                price: mealInput.price ?? existingMeal.price,
                image: mealInput.image ?? existingMeal.image,
                isAvailable: mealInput.isAvailable ?? existingMeal.isAvailable,
            },
        });

        return updatedMeal;
    });
}

const deleteMeal = async ( mealId: string ) => {
    if (!mealId) {
        throw new Error("Meal ID is required to delete a meal");
    }

    const deletedMeal = await prisma.meal.delete({
        where: { id: mealId },
    });

    return deletedMeal;
}

export const MealService = {
    createMeal,
    getAllMeals,
    getOneMeal,
    updateMeal
}