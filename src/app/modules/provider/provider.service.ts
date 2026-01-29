
import { ProviderProfileWhereInput } from "../../../../generated/prisma/models";
import { prisma } from "../../../lib/prisma";
import { UserRole } from "../../middleware/auth";
import { ProviderInput } from "./provider.interface";


const createProvider = async ( userId: string, providerInput: ProviderInput ) => {
  if (!userId) {
    throw new Error("User ID is required to create a provider");
  }

  return await prisma.$transaction(async (tx) => {
    
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (user.role !== UserRole.PROVIDER) {
      throw new Error("User must have PROVIDER role");
    }

    const existingProvider = await tx.providerProfile.findUnique({
      where: { userId },
    });

    if (existingProvider) {
      throw new Error("Provider profile already exists for this user");
    }

    const provider = await tx.providerProfile.create({
      data: {
        userId,
        restaurantName: providerInput.restaurantName,
        description: providerInput.description ?? null,
        address: providerInput.address,
        phone: providerInput.phone,
        isOpen: providerInput.isOpen ?? true,
      },
    });

    return provider;
  });
};

const getProviderById = async ( providerId: string ) => {
    const provider = await prisma.providerProfile.findUnique({
        where: { id: providerId }
    });
    if (!provider) {
        throw new Error("Provider not found");
    }
    return provider;
}

const getAllProviders = async ( {search, isOpen, page, limit, skip, sortBy, sortOrder}: 
    {search: string | undefined, isOpen: boolean | undefined, page: number, limit: number, skip: number, sortBy: string, sortOrder: string}) => {
    
    const andConditions: ProviderProfileWhereInput[] = [];
    if (search) {
        andConditions.push({
            OR: [
                { restaurantName: { contains: search, mode: "insensitive" } },
            ]
        });
    }

    if (typeof isOpen === 'boolean') {
        andConditions.push({
            isOpen
        })
    }


    const data =await prisma.providerProfile.findMany({
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
            restaurantName: true,
            address: true,
            phone: true,
            isOpen: true 
        }
    });

    const total = await prisma.providerProfile.count({
        where: {
            AND: andConditions
        }
    })

    return {
        data,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
}

const updateProvider = async ( providerId: string, providerInput: ProviderInput ) => {
    if (!providerId) {
        throw new Error("Provider ID is required to update a provider");
    }

    return await prisma.$transaction(async (tx) => {
        const existingProvider = await tx.providerProfile.findUnique({
            where: { id: providerId },
        });

        if (!existingProvider) {
            throw new Error("Provider profile does not exist");
        }

        const updatedProvider = await tx.providerProfile.update({
            where: { id: providerId },
            data: {
                restaurantName: providerInput.restaurantName,
                description: providerInput.description ?? existingProvider.description,
                address: providerInput.address,
                phone: providerInput.phone,
                isOpen: providerInput.isOpen ?? existingProvider.isOpen,
            },
        });

        return updatedProvider;
    });
}


export const ProviderService = {
    createProvider,
    getProviderById,
    getAllProviders,
    updateProvider
};