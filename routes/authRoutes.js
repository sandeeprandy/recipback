import { Router } from "express";
import authController from "../controllers/authController.js";
import posts from "../controllers/Posts.js";

const router = Router();
console.log("Registering /register route...");

router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/addPost", posts.addPost);

export default router;
