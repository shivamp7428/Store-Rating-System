import { getStoresForUser, getUserRatings, findRating, createRating, updateRating } from "../models/userModel.js";

const validateRating = (rating) => {
    const value = Number(rating);
    return Number.isInteger(value) && value >= 1 && value <= 5;
};

const buildPagination = (page, limit, total) => ({
    page: Number(page),
    limit: Number(limit),
    total,
    totalPages: Math.ceil(total / Number(limit)),
});

const serverError = (res, error) => {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
};

export const getStores = async (req, res) => {
    try {
        const { search = "", page = 1, limit = 10 } = req.query;

        const result = await getStoresForUser(req.user.id, search, Number(page), Number(limit));

        return res.status(200).json({
            stores: result.stores,
            pagination: buildPagination(page, limit, result.total),
        });
    } catch (error) {
        return serverError(res, error);
    }
};

export const submitRating = async (req, res) => {
    try {
        const storeId = Number(req.params.storeId);
        const { rating } = req.body;

        if (!Number.isInteger(storeId) || storeId < 1) {
            return res.status(400).json({ message: "Invalid store ID" });
        }

        if (!validateRating(rating)) {
            return res.status(400).json({ message: "Rating must be an integer between 1 and 5" });
        }

        if (await findRating(req.user.id, storeId)) {
            return res.status(409).json({ message: "Rating already submitted. Use update rating." });
        }

        await createRating(req.user.id, storeId, Number(rating));

        return res.status(201).json({ message: "Rating submitted successfully" });
    } catch (error) {
        if (error.code === "ER_NO_REFERENCED_ROW_2") {
            console.error(error);
            return res.status(404).json({ message: "Store not found" });
        }

        return serverError(res, error);
    }
};

export const modifyRating = async (req, res) => {
    try {
        const storeId = Number(req.params.storeId);
        const { rating } = req.body;

        if (!Number.isInteger(storeId) || storeId < 1) {
            return res.status(400).json({ message: "Invalid store ID" });
        }

        if (!validateRating(rating)) {
            return res.status(400).json({ message: "Rating must be an integer between 1 and 5" });
        }

        if (!(await findRating(req.user.id, storeId))) {
            return res.status(404).json({ message: "Rating not found. Submit a rating first." });
        }

        await updateRating(req.user.id, storeId, Number(rating));

        return res.status(200).json({ message: "Rating updated successfully" });
    } catch (error) {
        return serverError(res, error);
    }
};

export const getRatings = async (req, res) => {
    try {
        const { page = 1, limit = 9 } = req.query;

        const result = await getUserRatings(req.user.id, Number(page), Number(limit));

        return res.status(200).json({
            ratings: result.ratings,
            pagination: buildPagination(page, limit, result.total),
        });
    } catch (error) {
        return serverError(res, error);
    }
};