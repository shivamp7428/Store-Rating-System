import bcrypt from "bcryptjs";
import { pool } from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();

const createAdmin = async () => {
    try {
        const name = "System Administrator";
        const email = "admin@store.com";
        const password = "Admin@123";
        const address = "Bhopal, Madhya Pradesh";
        const role = "ADMIN";

        const passwordHash = await bcrypt.hash(password, 10);
        const [result] = await pool.execute(
            `INSERT INTO users
            (name, email, password_hash, address, role)
            VALUES (?, ?, ?, ?, ?)`,
            [name, email, passwordHash, address, role]
        );
        console.log("Admin created successfully:", result.insertId);
    } catch (error) {
        console.error("Error creating admin:", error.message);
    } finally {
        await pool.end();
    }
};

createAdmin();