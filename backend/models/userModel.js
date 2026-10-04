import { pool } from "../config/db.js";

export const createUser = async (name, email, passwordHash, address, role) => {
    const [result] = await pool.execute(
        `INSERT INTO users (name, email, password_hash, address, role) VALUES (?, ?, ?, ?, ?)`,
        [name, email, passwordHash, address, role]
    );

    return result;
};

export const findUserByEmail = async (email) => {
    const [rows] = await pool.execute(
        `SELECT id, name, email, password_hash, address, role FROM users WHERE email = ?`,
        [email]
    );

    return rows[0];
};

export const findUserById = async (id) => {
    const [rows] = await pool.execute(
        `SELECT id, name, email, password_hash, address, role FROM users WHERE id = ?`,
        [id]
    );

    return rows[0];
};

export const updateUserPassword = async (id, passwordHash) => {
    const [result] = await pool.execute(
        `UPDATE users SET password_hash = ? WHERE id = ?`,
        [passwordHash, id]
    );

    return result;
};

export const findStoreOwnerById = async (id) => {
    const [rows] = await pool.execute(
        `SELECT id, name, email, role FROM users WHERE id = ? AND role = 'STORE_OWNER'`,
        [id]
    );

    return rows[0];
};

export const getStoresForUser = async (
    userId,
    search,
    page = 1,
    limit = 10
) => {
    const offset = (page - 1) * limit;

    let query =
        `SELECT s.id, s.name AS storeName, s.address AS storeAddress, COALESCE(AVG(r.rating), 0) AS overallRating, ur.rating AS userRating ` +
        `FROM stores s LEFT JOIN ratings r ON s.id = r.store_id LEFT JOIN ratings ur ON s.id = ur.store_id AND ur.user_id = ? WHERE 1 = 1`;

    const values = [userId];

    if (search) {
        query += ` AND (s.name LIKE ? OR s.address LIKE ?)`;

        const searchValue = `%${search}%`;

        values.push(searchValue, searchValue);
    }

    query += ` GROUP BY s.id, s.name, s.address, ur.rating ORDER BY s.name ASC LIMIT ? OFFSET ?`;

    values.push(Number(limit), Number(offset));

    const [rows] = await pool.execute(query, values);

    let countQuery = `SELECT COUNT(*) AS total FROM stores s WHERE 1 = 1`;

    const countValues = [];

    if (search) {
        countQuery += ` AND (s.name LIKE ? OR s.address LIKE ?)`;

        const searchValue = `%${search}%`;

        countValues.push(searchValue, searchValue);
    }

    const [countRows] = await pool.execute(countQuery, countValues);

    return {
        stores: rows,
        total: Number(countRows[0].total),
    };
};

export const findRating = async (userId, storeId) => {
    const [rows] = await pool.execute(
        `SELECT id, rating FROM ratings WHERE user_id = ? AND store_id = ?`,
        [userId, storeId]
    );

    return rows[0];
};

export const createRating = async (userId, storeId, rating) => {
    const [result] = await pool.execute(
        `INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)`,
        [userId, storeId, rating]
    );

    return result;
};

export const updateRating = async (userId, storeId, rating) => {
    const [result] = await pool.execute(
        `UPDATE ratings SET rating = ? WHERE user_id = ? AND store_id = ?`,
        [rating, userId, storeId]
    );

    return result;
};

export const getUserRatings = async (
    userId,
    page = 1,
    limit = 9
) => {
    const offset = (page - 1) * limit;

    const [rows] = await pool.execute(
        `SELECT r.id AS ratingId, s.id AS storeId, s.name AS storeName, s.address AS storeAddress, r.rating ` +
        `FROM ratings r INNER JOIN stores s ON r.store_id = s.id WHERE r.user_id = ? ORDER BY s.name ASC LIMIT ? OFFSET ?`,
        [userId, Number(limit), Number(offset)]
    );

    const [countRows] = await pool.execute(
        `SELECT COUNT(*) AS total FROM ratings WHERE user_id = ?`,
        [userId]
    );

    return {
        ratings: rows,
        total: Number(countRows[0].total),
    };
};