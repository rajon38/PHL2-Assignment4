import { Request, Response } from "express";
import { ProviderService } from "./provider.service";
import paginationSortingHelper from "../../../helpers/paginationSortingHelper";

const createProvider = async (req: Request, res: Response) => {
    const user = req?.user as any;
    const providerInput = req.body;

    if (!providerInput.restaurantName || !providerInput.address || !providerInput.phone) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const provider = await ProviderService.createProvider(user?.id, providerInput);
        return res.status(201).json(provider);
    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    }
}

const getAllProviders = async (req: Request, res: Response) => {
    try {
    const { search } = req.query
    const searchString = typeof search === 'string' ? search : undefined
    const isOpen = req.query.isOpen
            ? req.query.isOpen === 'true'
                ? true
                : req.query.isOpen === 'false'
                    ? false
                    : undefined
            : undefined

    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(req.query)

    const result = await ProviderService.getAllProviders({ search: searchString, isOpen, page, limit, skip, sortBy, sortOrder })
        res.status(200).json(result)
    } catch (e) {
        res.status(400).json({
            error: "Could not fetch providers",
            details: e
        })
    }
}

const getProviderById = async (req: Request, res: Response) => {
    const providerId = req.params.id as string;
    try {
        const provider = await ProviderService.getProviderById(providerId);
        return res.status(200).json(provider);
    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    }
}

const updateProvider = async (req: Request, res: Response) => {
    const providerId = req.params.id as string;
    const providerInput = req.body;

    try {
        const updatedProvider = await ProviderService.updateProvider(providerId, providerInput);
        return res.status(200).json(updatedProvider);
    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    }
}


export const ProviderController = {
    createProvider,
    getAllProviders,
    getProviderById,
    updateProvider
}