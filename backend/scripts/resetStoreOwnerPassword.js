import bcrypt from "bcryptjs";
import { pool } from "../config/db.js";

const resetPassword = async () => {
    try {
        const email = "rahul.owner75@example.com";
        const passwordHash = await bcrypt.hash("Store@123", 10);

        const [users] = await pool.execute(
            `
            SELECT id, email, role
            FROM users
            WHERE email = ?
              AND role = 'STORE_OWNER'
            `,
            [email]
        );

        if (users.length === 0) {
            console.log("Store owner not found");
            return;
        }

        await pool.execute(
            `
            UPDATE users
            SET password_hash = ?
            WHERE email = ?
              AND role = 'STORE_OWNER'
            `,
            [passwordHash, email]
        );

        console.log("Store owner password reset successfully");
        console.log("Email:", email);
        console.log("Password: Store@123");

    } catch (error) {
        console.error(error);
    } finally {
        await pool.end();
    }
};

resetPassword();