import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {createUser,findUserByEmail,findUserById,updateUserPassword} from "../models/userModel.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).+$/;

const validatePassword = (password) => {
    if (password.length < 8 || password.length > 16) {
        return "Password must be between 8 and 16 characters";
    }
    if (!passwordRegex.test(password)) {
        return "Password must contain at least one uppercase letter and one special character";
    }
    return null;
};


export const signup = async (req, res) => {
    try {
        const { name, email, address, password } = req.body;

        if (!name || !email || !address || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (name.length < 20 || name.length > 60) {
            return res.status(400).json({message: "Name must be between 20 and 60 characters"});
        }

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        if (address.length > 400) {
            return res.status(400).json({message: "Address must not exceed 400 characters"});
        }

        const passwordError = validatePassword(password);

        if (passwordError) {
            return res.status(400).json({ message: passwordError });
        }

        const existingUser = await findUserByEmail(email);

        if (existingUser) {
            return res.status(409).json({ message: "Email already exists" });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const result = await createUser(name,email,passwordHash,address,"USER");

        const user = { id: result.insertId, name, email, address, role: "USER",};

        const token = jwt.sign({id: user.id,role: user.role,},process.env.JWT_SECRET,{expiresIn: "1d",});

        return res.status(201).json({message: "User created successfully",token,user,});

    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Something went wrong"});
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({message: "Email and password are required"});
        }
        if (!emailRegex.test(email)) {
            return res.status(400).json({message: "Invalid email format"});
        }
        const user = await findUserByEmail(email);

        if (!user) {
            return res.status(401).json({message: "Invalid email or password"});
        }
        const isPasswordValid = await bcrypt.compare(password,user.password_hash);

        if (!isPasswordValid) {
            return res.status(401).json({message: "Invalid email or password"});
        }

        const token = jwt.sign({id: user.id,role: user.role},process.env.JWT_SECRET,{expiresIn: "1d"});

        return res.status(200).json({message: "Login successful", token, user: { id: user.id, name: user.name, email: user.email,address: user.address, role: user.role,},});

    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Something went wrong"});
    }
};


export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({message: "Current password and new password are required"});
        }
        const passwordError = validatePassword(newPassword);
        if (passwordError) {
            return res.status(400).json({ message: passwordError});
        }

        const user = await findUserById(req.user.id);

        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        const isPasswordValid = await bcrypt.compare(currentPassword,user.password_hash);

        if (!isPasswordValid) {
            return res.status(401).json({message: "Current password is incorrect"});
        }

        const isSamePassword = await bcrypt.compare(newPassword,user.password_hash);

        if (isSamePassword) {
            return res.status(400).json({message: "New password must be different from current password"});
        }

        const newPasswordHash = await bcrypt.hash(newPassword, 10);

        await updateUserPassword(req.user.id,newPasswordHash);
        return res.status(200).json({message: "Password changed successfully"});

    } catch (error) {
        console.error(error);

        return res.status(500).json({message: "Something went wrong"});
    }
};