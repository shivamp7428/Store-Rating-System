import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const connectDB = async () => {
    try {
        await pool.query("SELECT 1");
        console.log("MySQL connected to DB");
    } catch (error) {
        console.error("Error on MySQL:", error.message);
        process.exit(1);
    }
};

export { pool, connectDB };