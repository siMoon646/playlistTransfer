import express from "express";
import { convert } from "../controllers/convertControllers.js";
 
const router = express.Router();
 
router.post("/", convert);
 
export default router;