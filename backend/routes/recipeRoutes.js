import express from "express";
import { recipeController } from "../controllers/recipeController.js";
import { authUser } from "../middleware/auth.js";

const router = express.Router();

//Rutas protegidas
router.use(authUser);

//Ruta de recetas
router.post("/recipes", recipeController.insertRecipe);
router.get("/recipes/search", recipeController.getFilteredRecipes);
router.get("/recipes", recipeController.getAllRecipes);
router.get("/recipes/:id", recipeController.getRecipe);
router.put("/recipes/:id", recipeController.updateRecipe);
router.delete("/recipes/:id", recipeController.deleteRecipe);

export default router;
