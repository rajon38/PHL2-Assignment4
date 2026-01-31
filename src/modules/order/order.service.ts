

import { prisma } from "../../lib/prisma";
import { CreateOrderInput } from "./order.interface";
import { OrderStatus, Prisma } from "../../../prisma/generated/prisma/client";

const createOrder = async (userId: string, data: CreateOrderInput) => {
    if(!userId) {
        throw new Error("Unauthorized");
    }

    return prisma.$transaction(async (prisma) => {
        if (!data.items || data.items.length === 0) {
            throw new Error("Order must contain at least one item");
        }
        const meals = await prisma.meal.findMany({
                where: {
                id: {
                        in: data.items.map(item => item.mealId),
                    },
                },
            });

        if (meals.length !== data.items.length) {
            throw new Error("One or more meals not found");
        }

        let totalPrice = 0;


        const orderItems = data.items.map(item => {
        const meal = meals.find(m => m.id === item.mealId)!;
        const itemTotal = meal.price * item.quantity;


        totalPrice += itemTotal;


        return {
            mealId: meal.id,
            quantity: item.quantity,
            price: meal.price,
        };
        });

        const order = await prisma.order.create({
                        data: {
                            customerId: userId,
                            providerId: data.providerId,
                            deliveryAddress: data.deliveryAddress,
                            paymentMethod: data.paymentMethod ?? "COD",
                            totalPrice,
                            items: {
                                create: orderItems,
                            },
                        },
                        include: {
                            items: {
                                include: {
                                    meal: true,
                                },
                            },
                        customer: true,
                        provider: true,
                        },
                    });


        return order;
    })
}

const getAllOrders = async ({customerId, providerId, page, limit, skip, sortBy, sortOrder}: 
    {customerId?: string, providerId?: string, page: number, limit: number, skip: number, sortBy: string, sortOrder: string}) => {

    const andConditions: Prisma.OrderWhereInput[] = [];
    
    if (typeof customerId === "string") {
        andConditions.push({
            customerId
        });
    }

    if (typeof providerId === "string") {
        andConditions.push({
            providerId
        });
    }
    
    const orders = await prisma.order.findMany({
        where: {
            AND: andConditions
        },
        take: limit,
        skip,
        orderBy: {
            [sortBy || 'createdAt']: sortOrder || 'desc'
        },
        include: {
            items: {
                include: {
                    meal: true,
                },
            },
            customer: true,
            provider: true,
        },
    });

    const totalOrders = await prisma.order.count({
        where: {
            AND: andConditions
        }
    });
    return { orders,
        meta: {
            total: totalOrders,
            page,
            limit,
            totalPages: Math.ceil(totalOrders / limit )
        } 
    };
}

const updateOrderById = async (orderId: string,  userId: string, data: Partial<CreateOrderInput>) => {
    return prisma.$transaction(async (tx) => {

    const order = await tx.order.findUnique({
        where: { id: orderId },
            include: {
                items: true,
                customer: true,
            },
        });


    if (!order) {
        throw new Error("Order not found");
    }
    const user = await tx.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new Error("User not found");
    }

    if (order.customerId !== userId) {
        throw new Error("Unauthorized to update this order");
    }

    if (order.status !== OrderStatus.PENDING) {
        throw new Error("Only pending orders can be updated");
    }

    let totalPrice = order.totalPrice;

    if (data.items) {
        if (data.items.length === 0) {
            throw new Error("Order must contain at least one item");
        }

    const meals = await tx.meal.findMany({
        where: {
            id: { in: data.items.map(i => i.mealId) },
        },
    });

    if (meals.length !== data.items.length) {
        throw new Error("One or more meals not found");
    }

    totalPrice = 0;


    const newItems = data.items.map(item => {
    const meal = meals.find(m => m.id === item.mealId)!;
    totalPrice += meal.price * item.quantity;


    return {
        mealId: meal.id,
        quantity: item.quantity,
        price: meal.price,
    };
    });

    await tx.orderItem.deleteMany({
        where: { orderId },
    });


    await tx.orderItem.createMany({
        data: newItems.map(i => ({ ...i, orderId })),
    });
    }


    const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: {
            deliveryAddress: data.deliveryAddress ?? order.deliveryAddress,
            paymentMethod: data.paymentMethod ?? order.paymentMethod,
            totalPrice,
        },
        include: {
            items: {
                include: { meal: true },
            },
        },
    });

    return updatedOrder;
    });
};


const orderStatusUpdate = async (orderId: string, status: OrderStatus) => {
    if(!orderId) {
        throw new Error("Order ID is required");
    }
    const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: {
            status: status,
        },
        include: {
            items: {
                include: {
                    meal: true,
                },
            },
            customer: true,
            provider: true,
        },
    });

    return updatedOrder;
}

const deleteOrder = async (orderId: string) => {
    if(!orderId) {
        throw new Error("Order ID is required");
    }

    await prisma.order.delete({
        where: { id: orderId },
    });

    return { message: "Order deleted successfully"};
}   


export const OrderService = {
    createOrder,
    getAllOrders,
    updateOrderById,
    orderStatusUpdate,
    deleteOrder,
};