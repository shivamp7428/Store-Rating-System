import { pool } from "../config/db.js";

const createStore = async (name, email, address, ownerId) => {
    const [result] = await pool.execute(
        `INSERT INTO stores
        (name, email, address, owner_id)
        VALUES (?, ?, ?, ?)`,
        [name, email, address, ownerId]
    );

    return result;
};

export { createStore };