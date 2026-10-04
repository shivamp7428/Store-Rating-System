
import {getOwnerDashboard,getStoreRatings,getOwnerAverageRating} from "../models/storeOwnerModel.js";

export const getDashboard = async (req, res) => {
    try {
        const ownerId = req.user.id;

        const [stores, ratings, averageRating] = await Promise.all([
            getOwnerDashboard(ownerId),
            getStoreRatings(ownerId),
            getOwnerAverageRating(ownerId)
        ]);

        if (stores.length === 0) {
            return res.status(404).json({message: "No stores found for this owner"});
        }

        return res.status(200).json({averageRating: Number(Number(averageRating).toFixed(2)),stores,ratings});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Something went wrong"});
    }
};