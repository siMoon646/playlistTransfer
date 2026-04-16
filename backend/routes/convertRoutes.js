import express from "express";
import { convert } from "../controllers/convertController.js";
 
const router = express.Router();
 
router.post("/", convert);
 
export default router;