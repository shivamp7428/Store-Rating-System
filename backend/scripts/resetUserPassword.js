import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
    path: path.resolve(__dirname, "../.env"),
});

const { pool } = await import("../config/db.js");

const resetPassword = async () => {
    try {
        const password = "Store@123";

        const passwordHash = await bcrypt.hash(password, 10);

        const [result] = await pool.execute(
            `
            UPDATE users
            SET password_hash = ?
            WHERE email = ?
            `,
            [passwordHash, "kabir.sharma06@example.com"]
        );

        if (result.affectedRows === 0) {
            console.log("User not found");
            return;
        }

        console.log("Password reset successfully");
        console.log("Email: kabir.sharma06@example.com");
        console.log("Password: Store@123");

    } catch (error) {
        console.error(error.message);
    } finally {
        await pool.end();
    }
};

resetPassword();