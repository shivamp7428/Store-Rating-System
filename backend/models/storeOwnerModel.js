import { pool } from "../config/db.js";

export const getOwnerDashboard = async (ownerId) => {
    const [rows] = await pool.execute(
        `SELECT s.id AS storeId, s.name AS storeName, COALESCE(AVG(r.rating), 0) AS averageRating, COUNT(r.id) AS totalRatings
        FROM stores s LEFT JOIN ratings r ON r.store_id = s.id WHERE s.owner_id = ? GROUP BY s.id, s.name ORDER BY s.name ASC`,
        [ownerId]
    );

    return rows;
};

export const getStoreRatings = async (ownerId) => {
    const [rows] = await pool.execute(
        `SELECT s.id AS storeId, s.name AS storeName, u.id AS userId, u.name AS userName, u.email AS userEmail, r.rating, r.created_at AS ratedAt
        FROM stores s JOIN ratings r ON r.store_id = s.id JOIN users u ON u.id = r.user_id WHERE s.owner_id = ? ORDER BY s.name ASC, r.created_at DESC`,
        [ownerId]
    );

    return rows;
};

export const getOwnerAverageRating = async (ownerId) => {
    const [rows] = await pool.execute(
        `SELECT COALESCE(AVG(r.rating), 0) AS averageRating FROM stores s JOIN ratings r ON r.store_id = s.id WHERE s.owner_id = ?`,
        [ownerId]
    );

    return rows[0].averageRating;
};