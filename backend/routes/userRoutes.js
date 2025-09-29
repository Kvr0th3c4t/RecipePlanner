import express from "express";
import { userController } from "../controllers/UserController.js";
import { loginController } from "../controllers/loginController.js";
import { authUser } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", userController.createUser);
router.post("/login", loginController.login);
router.post("/refresh", loginController.refresh);

//Rutas protegidas
router.use(authUser);

//ruta de prueba
router.get("/profile", userController.getUserProfile);
router.post("/logout", loginController.logout);

export default router;
