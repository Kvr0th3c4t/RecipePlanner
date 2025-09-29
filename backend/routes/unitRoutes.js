import express from "express";
import { authUser } from "../middleware/auth.js";
import { unitController } from "../controllers/unitController.js";

const router = express.Router();

//Rutas protegidas
router.use(authUser);

//Ruta de plan
router.get("/units", unitController.getAllUnits);

export default router;
