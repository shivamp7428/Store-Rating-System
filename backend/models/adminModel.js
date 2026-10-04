import { pool } from "../config/db.js";

export const getDashboardStats = async () => {
    const [rows] = await pool.execute(`SELECT (SELECT COUNT(*) FROM users) AS totalUsers, (SELECT COUNT(*) FROM stores) AS totalStores, (SELECT COUNT(*) FROM ratings) AS totalRatings`);

    return rows[0];
};

export const getAllStores = async (search, sortBy = "name", sortOrder = "ASC", limit = 10, offset = 0) => {
    let query = `SELECT s.id, s.name AS storeName, s.email AS storeEmail, s.address AS storeAddress, u.name AS ownerName, u.email AS ownerEmail, COALESCE(AVG(r.rating), 0) AS overallRating
        FROM stores s JOIN users u ON s.owner_id = u.id LEFT JOIN ratings r ON s.id = r.store_id WHERE 1 = 1`;

    const values = [];

    if (search) {
        query += ` AND (s.name LIKE ? OR s.email LIKE ? OR s.address LIKE ?)`;
        const searchValue = `%${search}%`;
        values.push(searchValue, searchValue, searchValue);
    }

    const allowedSortFields = ["name", "email", "address"];
    const allowedSortOrders = ["ASC", "DESC"];

    if (!allowedSortFields.includes(sortBy)) {
        sortBy = "name";
    }

    if (!allowedSortOrders.includes(sortOrder)) {
        sortOrder = "ASC";
    }

    const sortColumnMap = { name: "s.name", email: "s.email", address: "s.address" };

    query += ` GROUP BY s.id, s.name, s.email, s.address, u.name, u.email ORDER BY ${sortColumnMap[sortBy]} ${sortOrder} LIMIT ? OFFSET ?`;

    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);

    return rows;
};

export const countStores = async (search) => {
    let query = `SELECT COUNT(*) AS total FROM stores s WHERE 1 = 1`;
    const values = [];

    if (search) {
        query += ` AND (s.name LIKE ? OR s.email LIKE ? OR s.address LIKE ?)`;
        const searchValue = `%${search}%`;
        values.push(searchValue, searchValue, searchValue);
    }

    const [rows] = await pool.execute(query, values);

    return rows[0].total;
};

export const getAllUsers = async (search, role, sortBy = "name", sortOrder = "ASC", limit = 10, offset = 0) => {
    let query = `SELECT id, name, email, address, role FROM users WHERE 1 = 1`;
    const values = [];

    if (search) {
        query += ` AND (name LIKE ? OR email LIKE ? OR address LIKE ?)`;
        const searchValue = `%${search}%`;
        values.push(searchValue, searchValue, searchValue);
    }

    if (role) {
        query += ` AND role = ?`;
        values.push(role);
    }

    const allowedSortFields = ["name", "email", "address", "role"];
    const allowedSortOrders = ["ASC", "DESC"];

    if (!allowedSortFields.includes(sortBy)) {
        sortBy = "name";
    }

    if (!allowedSortOrders.includes(sortOrder)) {
        sortOrder = "ASC";
    }

    const sortColumnMap = { name: "name", email: "email", address: "address", role: "role" };

    query += ` ORDER BY ${sortColumnMap[sortBy]} ${sortOrder} LIMIT ? OFFSET ?`;

    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);

    return rows;
};

export const countUsers = async (search, role) => {
    let query = `SELECT COUNT(*) AS total FROM users WHERE 1 = 1`;
    const values = [];

    if (search) {
        query += ` AND (name LIKE ? OR email LIKE ? OR address LIKE ?)`;
        const searchValue = `%${search}%`;
        values.push(searchValue, searchValue, searchValue);
    }

    if (role) {
        query += ` AND role = ?`;
        values.push(role);
    }

    const [rows] = await pool.execute(query, values);

    return rows[0].total;
};

export const getUserDetails = async (userId) => {
    const [rows] = await pool.execute(
        `SELECT u.id, u.name, u.email, u.address, u.role, s.id AS storeId, s.name AS storeName, COALESCE(AVG(r.rating), 0) AS overallRating
        FROM users u LEFT JOIN stores s ON s.owner_id = u.id LEFT JOIN ratings r ON r.store_id = s.id WHERE u.id = ? GROUP BY u.id, u.name, u.email, u.address, u.role, s.id, s.name`,
        [userId]
    );

    return rows;
};