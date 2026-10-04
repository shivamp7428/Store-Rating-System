import bcrypt from "bcryptjs";
import { pool } from "../config/db.js";

const resetPassword = async () => {
    try {
        const passwordHash = await bcrypt.hash(
            "Owner@123",
            10
        );

        const [result] = await pool.execute(
            `
            UPDATE users
            SET password_hash = ?
            WHERE email = ?
              AND role = 'STORE_OWNER'
            `,
            [passwordHash, "owner@store.com"]
        );

        if (result.affectedRows === 0) {
            console.log("Store owner not found");
            return;
        }

        console.log("Store owner password reset successfully");
        console.log("Email: owner@store.com");
        console.log("Password: Owner@123");

    } catch (error) {
        console.error(error);
    } finally {
        await pool.end();
    }
};

resetPassword();