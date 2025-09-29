import express from "express";
import { authUser } from "../middleware/auth.js";
import { planController } from "../controllers/planController.js";

const router = express.Router();

//Rutas protegidas
router.use(authUser);

//Ruta de plan
router.get("/planning", planController.getPlan);
router.post("/planning/asignRecipe", planController.asignRecipeToPlan);
router.put("/planning/deleteRecipe", planController.deleteRecipe);
router.get("/planning/shopping-list", planController.getShoppingList);

export default router;
