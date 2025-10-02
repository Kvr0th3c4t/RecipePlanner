import { MESSAGES } from "../constants/messages.js";
import * as ingredientService from "../services/ingredientService.js";
import { validateIngredient } from "../schemas/ingredientSchema.js";
import { errorResponse, successResponse } from "../utils/responseHelper.js";

export class ingredientController {
  static async findIngredientByName(req, res) {
    const searchTerm = req.query.q || "";

    try {
      const ingredients = await ingredientService.searchIngredients(searchTerm);

      if (ingredients.length > 0) {
        return successResponse(res, 200, MESSAGES.INGREDIENT_FOUND, {
          ingredient: ingredients,
        });
      } else {
        return successResponse(res, 200, "Sin resultados", {
          ingredient: [],
        });
      }
    } catch (error) {
      return errorResponse(res, 500, MESSAGES.INTERNAL_ERROR);
    }
  }

  static async addIngredientToRecipe(req, res) {
    const validatedData = validateIngredient(req.body);
    const recipeId = req.params.id;
    const userId = req.user.usuario_id;

    if (!validatedData.success) {
      return errorResponse(res, 400, MESSAGES.INVALID_DATA);
    }

    try {
      await ingredientService.addIngredientToRecipe(
        userId,
        recipeId,
        validatedData.data
      );
      return successResponse(res, 201, MESSAGES.INGREDIENT_ADDED);
    } catch (error) {
      if (error.statusCode === 404) {
        return errorResponse(res, 404, MESSAGES.INGREDIENT_NOT_FOUND);
      }

      if (error.statusCode === 409) {
        return errorResponse(res, 409, MESSAGES.INGREDIENT_IN_USE);
      }

      return errorResponse(res, 500, MESSAGES.INTERNAL_ERROR);
    }
  }

  static async deleteIngredient(req, res) {
    const recipeId = req.params.id;
    const ingredientId = req.params.ingredientId;
    const userId = req.user.usuario_id;

    try {
      await ingredientService.deleteRecipeIngredient(
        userId,
        recipeId,
        ingredientId
      );
      return successResponse(res, 200, MESSAGES.INGREDIENT_DELETED);
    } catch (error) {
      if (error.statusCode === 404) {
        return errorResponse(res, 404, error.message);
      }
      return errorResponse(res, 500, MESSAGES.INTERNAL_ERROR);
    }
  }
}
