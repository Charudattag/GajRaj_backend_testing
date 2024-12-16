import express from 'express';
import {
  getAllUsers,
  createUser,
  updateUser,
  getUserById,
  deleteUser,
  login,
} from '../controllers/userController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get("/getalluser",authMiddleware,adminMiddleware, getAllUsers);
router.post("/adduser", createUser);
router.put("/update/:id",authMiddleware,adminMiddleware, updateUser);
router.get("/getuserbyid/:id",authMiddleware,adminMiddleware, getUserById);
router.delete("/deluserbyid/:id",authMiddleware,adminMiddleware, deleteUser);

router.post("/login", login);

export default router;
