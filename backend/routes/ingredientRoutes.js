import express from "express";
import { ingredientController } from "../controllers/ingredientController.js";
import { authUser } from "../middleware/auth.js";

const router = express.Router();

//Rutas protegidas
router.use(authUser);

//Ruta de ingredientes
router.get("/ingredients/search", ingredientController.findIngredientByName);
router.post(
  "/recipes/:id/ingredients",
  ingredientController.addIngredientToRecipe
);
router.get(
  "/recipes/:id/ingredients",
  ingredientController.getIngredientDetail
);
router.delete("/recipes/:id/ingredients/:ingredientId", ingredientController.deleteIngredient);
router.put(
  "/recipes/:id/ingredients/:ingredientId",
  ingredientController.updateIngredient
);

export default router;
