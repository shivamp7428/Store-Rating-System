import bcrypt from "bcryptjs";
import { pool } from "../config/db.js";

const resetPassword = async () => {
    try {
        const passwordHash = await bcrypt.hash("Store@123", 10);

        const [result] = await pool.execute(
            `
            UPDATE users
            SET password_hash = ?
            WHERE email = ?
              AND role = 'ADMIN'
            `,
            [passwordHash, "aarav.sharma01@example.com"]
        );

        if (result.affectedRows === 0) {
            console.log("Admin not found");
            return;
        }

        console.log("Admin password reset successfully");
        console.log("Email: aarav.sharma01@example.com");
        console.log("Password: Store@123");

    } catch (error) {
        console.error(error);
    } finally {
        await pool.end();
    }
};

resetPassword();