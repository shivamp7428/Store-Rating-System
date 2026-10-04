import bcrypt from "bcryptjs";
import { pool } from "../config/db.js";

const resetPassword = async () => {
    try {
        const passwordHash = await bcrypt.hash("Admin@123", 10);

        const [result] = await pool.execute(
            `
            UPDATE users
            SET password_hash = ?
            WHERE email = ?
              AND role = 'ADMIN'
            `,
            [passwordHash, "admin@store.com"]
        );

        if (result.affectedRows === 0) {
            console.log("Admin not found");
            return;
        }

        console.log("Admin password reset successfully");
        console.log("Email: admin@store.com");
        console.log("Password: Admin@123");

    } catch (error) {
        console.error(error);
    } finally {
        await pool.end();
    }
};

resetPassword();