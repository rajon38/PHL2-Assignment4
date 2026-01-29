import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";

const getUserById = async (req: Request, res: Response) => {
    const user = req?.user as any;
    try {
        const data = await AuthService.getUserById(user.id);
        return res.status(200).json(data);
    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    }
}

const getAllUsers = async (req: Request, res: Response) => {
    try {
        const { search } = req.query
        const searchString = typeof search === 'string' ? search : undefined
        const emailVerified = req.query.emailVerified
            ? req.query.emailVerified === 'true'
                ? true
                : req.query.emailVerified === 'false'
                    ? false
                    : undefined
            : undefined

    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(req.query)
    const result = await AuthService.getAllUsers({ search: searchString, emailVerified, page, limit, skip, sortBy, sortOrder })
        res.status(200).json(result)
    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    }
}

const updateProfile = async (req: Request, res: Response) => {
    const user = req?.user as any;
    const updateData = req.body;

    try {
        const updatedUser = await AuthService.updateProfile(user.id, updateData);
        return res.status(200).json(updatedUser);
    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    }
}

const deleteUser = async (req: Request, res: Response) => {
    const userId = req.params.id as string;

    try {
        await AuthService.deleteUser(userId);
        return res.status(200).json({ message: "User deleted successfully" });
    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    }
}

export const AuthController = {
    getUserById,
    getAllUsers,
    updateProfile,
    deleteUser
}