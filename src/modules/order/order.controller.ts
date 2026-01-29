import { Request, Response } from "express";
import { OrderService } from "./order.service";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";

const createOrder = async (req: Request, res: Response) => {
    try {
        const user = req?.user as any;
        const orderInput = req.body;

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const newOrder = await OrderService.createOrder(user.id, orderInput);
        return res.status(201).json(newOrder);
    } catch (error) {
        return res.status(400).json({ message: (error as Error).message });
    }
};

const getAllOrders = async (req: Request, res: Response) => {
    try {
        const { customerId, providerId } = req.query as { customerId: string; providerId: string };
        const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(req.query)

        const orders = await OrderService.getAllOrders({ customerId, providerId, page, limit, skip, sortBy, sortOrder });
        return res.status(200).json(orders);
    } catch (e) {
        res.status(400).json({
            error: "Could not fetch orders",
            details: e
        })
    }
};

const updateOrderById = async (req: Request, res: Response) => {
    try {
        const orderId = req.params.id as string;
        const user = req?.user as any;
        const data = req.body;

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const updatedOrder = await OrderService.updateOrderById(orderId, user.id, data);
        return res.status(200).json(updatedOrder);
    } catch (error) {
        return res.status(400).json({ message: (error as Error).message });
    }
}

const orderStatusUpdate = async (req: Request, res: Response) => {
    try {
        const orderId = req.params.id as string;
        const { status } = req.body;
        
        const updatedOrder = await OrderService.orderStatusUpdate(orderId, status);
        return res.status(200).json(updatedOrder);
    } catch (error) {
        return res.status(400).json({ message: (error as Error).message });
    }
};

const deleteOrder = async (req: Request, res: Response) => {
    try {
        const orderId = req.params.id as string;

        const deletedOrder = await OrderService.deleteOrder(orderId);
        return res.status(200).json(deletedOrder);
    } catch (error) {
        return res.status(400).json({ message: (error as Error).message });
    }
};

export const OrderController = {
    createOrder,
    getAllOrders,
    updateOrderById,
    orderStatusUpdate,
    deleteOrder,
};