
import { Prisma } from "../../../prisma/generated/prisma/client";
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

    const andConditions: Prisma.MealWhereInput[] = [];
    
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
        if (!meal) {
            throw new Error("Meal not found");
        }


        const reviewStats = await tx.review.aggregate({
            where: {
                mealId,
            },
            _count: {
                rating: true,
            },
            _avg: {
                rating: true,
            },
        });

    return {
        ...meal,
        totalReviews: reviewStats._count.rating,
        averageRating: reviewStats._avg.rating
        ? Number(reviewStats._avg.rating.toFixed(1))
        : 0,
        };
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

    return await prisma.$transaction(async (tx) => {
        const existingMeal = await tx.meal.findUnique({
            where: { id: mealId },
        });
        
        if (!existingMeal) {
            throw new Error("Meal does not exist");
        }
        await tx.review.deleteMany({
            where: { mealId: mealId }
        });

        const deletedMeal = await tx.meal.delete({
            where: { id: mealId },
        });
        
        return deletedMeal;
    });
}

export const MealService = {
    createMeal,
    getAllMeals,
    getOneMeal,
    updateMeal,
    deleteMeal
}