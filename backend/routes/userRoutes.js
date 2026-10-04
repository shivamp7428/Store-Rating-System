import express from "express";

import {getStores,submitRating,modifyRating, getRatings} from "../controllers/userController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/stores",authenticate,authorize("USER"),getStores);
router.post("/stores/:storeId/rating",authenticate,authorize("USER"),submitRating);
router.put("/stores/:storeId/rating",authenticate,authorize("USER"),modifyRating);
router.get("/ratings",authenticate,authorize("USER"),getRatings);

export default router;