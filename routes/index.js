import express from "express";
import authRoutes from "./authRoutes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/posts", authRoutes);
router.use("/user",  authRoutes )
export default router;
