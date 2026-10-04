import express from "express";
import {createUserByAdmin,createStoreByAdmin, getDashboard, getAllStoresByAdmin,getAllUsersByAdmin,getUserDetailsByAdmin} from "../controllers/adminController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/users",authenticate,authorize("ADMIN"),createUserByAdmin);
router.post("/stores",authenticate,authorize("ADMIN"),createStoreByAdmin);
router.get("/dashboard",authenticate,authorize("ADMIN"),getDashboard);
router.get("/stores",authenticate,authorize("ADMIN"),getAllStoresByAdmin);
router.get("/users",authenticate,authorize("ADMIN"),getAllUsersByAdmin);
router.get("/users/:id",authenticate,authorize("ADMIN"),getUserDetailsByAdmin);

export default router;