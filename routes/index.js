import express from "express";
import authRoutes from "./authRoutes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/posts", authRoutes);
export default router;
