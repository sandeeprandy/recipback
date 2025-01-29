import { Router } from "express";
import authController from "../controllers/authController.js";
import posts from "../controllers/Posts.js";
import users from "../controllers/users.js";

const router = Router();

router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/addPost", posts.addPost);
router.get("/getPosts" , posts.getPosts)
router.get("/feed", users.feed);

export default router;
