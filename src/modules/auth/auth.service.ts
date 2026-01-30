import { UserWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { AuthInput } from "./auth.interface";

const getUserById = async ( userId: string ) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            emailVerified: true,
            providerProfile:{
                select: {
                    restaurantName: true,
                    description: true,
                    address: true,
                    phone: true,
                    isOpen: true,
                }
            }
        }
    });
    if (!user) {
        throw new Error("User not found");
    }
    const { providerProfile, ...rest } = user;


    return {
        ...rest,
        ...(providerProfile ? { providerProfile } : {}),
    };
}

const getAllUsers = async ({search, emailVerified, page, limit, skip, sortBy, sortOrder}: 
    {search: string | undefined, emailVerified: boolean | undefined, page: number, limit: number, skip: number, sortBy: string, sortOrder: string}) => {
    
    const andConditions: UserWhereInput[] = [];

    if (search) {
        andConditions.push({
            OR: [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } }
            ]
        });
    }

    if (typeof emailVerified === 'boolean') {
        andConditions.push({
            emailVerified
        });
    }

    const users = await prisma.user.findMany({
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
            email: true,
            name: true,
            role: true,
            emailVerified: true,
        }
    });

    const total = await prisma.user.count({
        where: {
            AND: andConditions
        }
    });

    return {
        data: users,
        pagination: {
            total,
            page,
            limit
        }
    };
}

const updateProfile = async ( userId: string, updateData: AuthInput ) => {
    if (!userId) {
        throw new Error("User ID is required");
    }

    return await prisma.$transaction(async (tx) => {
        const existingUser = await tx.user.findUnique({
            where: { id: userId },
            select: { id: true , name: true, phone: true, image: true }
        });

        if (!existingUser) {
            throw new Error("User does not exist");
        }

        const updatedUser = await tx.user.update({
            where: { id: existingUser.id },
            data: {
                name: updateData.name || existingUser.name,
                phone: updateData.phone || existingUser.phone,
                image: updateData.image || existingUser.image
            },
        });

        return updatedUser;
    });
}

const deleteUser = async ( userId: string ) => {
    if (!userId) {
        throw new Error("User ID is required to delete a user");
    }
    return await prisma.$transaction(async (tx) => {
        const existingUser = await tx.user.findUnique({
            where: { id: userId },
            select: { id: true, role: true }
        });

        if (!existingUser) {
            throw new Error("User does not exist");
        }

        const deletedUser = await tx.user.delete({
            where: { id: userId },
        });

        return deletedUser;
    });
}



export const AuthService = {
    getUserById,
    getAllUsers,
    updateProfile,
    deleteUser
}