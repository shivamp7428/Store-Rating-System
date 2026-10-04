import bcrypt from "bcryptjs";

import {createUser,findStoreOwnerById} from "../models/userModel.js";
import { createStore } from "../models/storeModel.js";
import {getDashboardStats, getAllStores, countStores, getAllUsers, countUsers,getUserDetails} from "../models/adminModel.js";

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


export const createUserByAdmin = async (req, res) => {

    try {
        const { name,email, password, address, role} = req.body;
        if (!name || !email || !password || !address || !role) {
            return res.status(400).json({ message: "All fields are required"});
        }

        if (name.length < 20 || name.length > 60) {
            return res.status(400).json({message: "Name must be between 20 and 60 characters"});
        }

        if (!emailRegex.test(email)) {
            return res.status(400).json({message: "Invalid email format" });
        }

        if (address.length > 400) {
            return res.status(400).json({message: "Address must not exceed 400 characters" });
        }

        const allowedRoles = ["USER","ADMIN","STORE_OWNER"];

        if (!allowedRoles.includes(role)) {
            return res.status(400).json({message: "Invalid role" });
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
            return res.status(400).json({ message: passwordError});
        }

        const passwordHash = await bcrypt.hash( password, 10);
        const result = await createUser( name, email, passwordHash, address, role);

        return res.status(201).json({message: "User created successfully", userId: result.insertId });

    } catch (error) {
        console.error(error);
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({message: "Email already exists"});
        }
        return res.status(500).json({message: "Something went wrong"});
    }

};


export const createStoreByAdmin = async (req, res) => {

    try {

        const { name, email, address, ownerId } = req.body;

        if (!name || !email || !address || ownerId === undefined) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (name.length < 20 || name.length > 60) {
            return res.status(400).json({message: "Name must be between 20 and 60 characters"});
        }

        if (!emailRegex.test(email)) {
            return res.status(400).json({message: "Invalid email format"});
        }

        if (address.length > 400) {
            return res.status(400).json({message: "Address must not exceed 400 characters"});
        }

        if (!Number.isInteger(Number(ownerId))) {
            return res.status(400).json({ message: "Invalid owner ID" });
        }

        const owner = await findStoreOwnerById( Number(ownerId) );
        
        if (!owner) {
            return res.status(400).json({ message: "Invalid store owner" });
        }
        const result = await createStore( name, email, address, Number(ownerId) );
        return res.status(201).json({ message: "Store created successfully", storeId: result.insertId});
    } catch (error) {
        console.error(error);
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ message: "Store email already exists"});
        }
        return res.status(500).json({ message: "Something went wrong"});
    }
};


export const getDashboard = async (req, res) => {
    try {
        const stats = await getDashboardStats();
        return res.status(200).json({totalUsers: stats.totalUsers, totalStores: stats.totalStores, totalRatings: stats.totalRatings});

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong"});
    }
};

export const getAllStoresByAdmin = async (req, res) => {
    try {
        const {search, sortBy = "name",sortOrder = "ASC",page = 1,limit = 10} = req.query;
        const currentPage = Number(page);
        const pageLimit = Number(limit);
        if (!Number.isInteger(currentPage) || currentPage < 1 || !Number.isInteger(pageLimit) || pageLimit < 1 || pageLimit > 100) {
            return res.status(400).json({ message: "Invalid page or limit" });
        }
        const offset = (currentPage - 1) * pageLimit;
        const [stores, total] = await Promise.all([
            getAllStores(search,sortBy,sortOrder.toUpperCase(),pageLimit,offset),
            countStores(search)
        ]);

        return res.status(200).json({ page: currentPage, limit: pageLimit, total, totalPages: Math.ceil(total / pageLimit), stores});

    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Something went wrong"});
    }
};


export const getAllUsersByAdmin = async (req, res) => {
    try {
        const {search,role,sortBy = "name",sortOrder = "ASC",page = 1,limit = 10} = req.query;
        const currentPage = Number(page);
        const pageLimit = Number(limit);

        const allowedRoles = [ "USER", "ADMIN", "STORE_OWNER"];
        if (role && !allowedRoles.includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        if ( !Number.isInteger(currentPage) || currentPage < 1 || !Number.isInteger(pageLimit) || pageLimit < 1 || pageLimit > 100) {
            return res.status(400).json({ message: "Invalid page or limit"});
        }

        const offset = (currentPage - 1) * pageLimit;
        const [users, total] = await Promise.all([
            getAllUsers(search, role, sortBy, sortOrder.toUpperCase(), pageLimit, offset),
            countUsers(search, role)
        ]);

        return res.status(200).json({ page: currentPage, limit: pageLimit, total, totalPages: Math.ceil(total / pageLimit), users});

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong"});
    }
};

export const getUserDetailsByAdmin = async (req, res) => {
    try {
        const userId = Number(req.params.id);

        if (!Number.isInteger(userId) || userId < 1) {
            return res.status(400).json({message: "Invalid user ID"});
        }

        const users = await getUserDetails(userId);

        if (users.length === 0) {
            return res.status(404).json({message: "User not found"});
        }

        const user = users[0];

        const response = {
            id: user.id,
            name: user.name,
            email: user.email,
            address: user.address,
            role: user.role
        };

        if (user.role === "STORE_OWNER") {
            response.store = user.storeId ? { id: user.storeId, name: user.storeName, overallRating: user.overallRating } : null;
        }

        return res.status(200).json(response);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong"});
    }
};