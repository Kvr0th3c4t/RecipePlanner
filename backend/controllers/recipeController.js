import * as recipeService from "../services/recipeService.js";
import { validateRecipe } from "../schemas/recipeSchema.js";
import { successResponse, errorResponse } from "../utils/responseHelper.js";
import { MESSAGES } from "../constants/messages.js";

export class recipeController {
  /**
   * POST /api/recipes
   * Crea una nueva receta
   */

  static async insertRecipe(req, res) {
    const validation = validateRecipe(req.body);

    if (!validation.success) {
      return errorResponse(res, 400, MESSAGES.INVALID_DATA);
    }

    const userId = req.user.usuario_id;
    const recipeData = validation.data;

    try {
      const newRecipe = await recipeService.createRecipe(userId, recipeData);

      return successResponse(res, 201, MESSAGES.RECIPE_CREATED, {
        recipe: newRecipe,
      });
    } catch (error) {
      return errorResponse(res, 500, MESSAGES.INTERNAL_ERROR);
    }
  }

  /**
   * GET /api/recipes
   * Obtenemos todas las recetas de un usuario
   */

  static async getAllRecipes(req, res) {
    const userId = req.user.usuario_id;

    try {
      const recipeArray = await recipeService.getAllUserRecipes(userId);

      if (recipeArray.length > 0) {
        return successResponse(res, 200, MESSAGES.RECIPES_RETRIEVED, {
          recetas: recipeArray,
        });
      } else {
        return successResponse(res, 200, MESSAGES.NO_RECIPES);
      }
    } catch (error) {
      return errorResponse(res, 500, MESSAGES.INTERNAL_ERROR);
    }
  }

  /**
   * GET /api/recipes/search
   * Filtramos por el nombre de receta
   */

  static async getFilteredRecipes(req, res) {
    const userId = req.user.usuario_id;
    const { searchType, searchTerm = "", page = 1, limit = 10 } = req.query;

    try {
      const result = await recipeService.searchRecipes(userId, {
        searchType,
        searchTerm,
        page,
        limit,
      });

      return successResponse(res, 200, MESSAGES.RECIPES_RETRIEVED, result);
    } catch (error) {
      if (error.statusCode === 400) {
        return errorResponse(res, 400, MESSAGES.DATABASE_ERROR);
      }
      return errorResponse(res, 500, MESSAGES.INTERNAL_ERROR);
    }
  }

  /**
   * GET /api/recipes/:id
   * Obtenemos una de las recetas del usuario por su id
   */

  static async getRecipe(req, res) {
    const userId = req.user.usuario_id;
    const recipeId = req.params.id;

    try {
      const result = await recipeService.getRecipeDetail(userId, recipeId);

      return successResponse(res, 200, MESSAGES.RECIPE_RETRIEVED, result);
    } catch (error) {
      if (error.statusCode === 404) {
        return errorResponse(res, 404, MESSAGES.RECIPE_NOT_FOUND);
      }
      return errorResponse(res, 500, MESSAGES.INTERNAL_ERROR);
    }
  }

  /**
   * PUT /api/recipes/:id
   * Actualizamos una de las recetas del usuario por su id
   */

  static async updateRecipe(req, res) {
    const validation = validateRecipe(req.body);

    if (!validation.success) {
      return errorResponse(res, 400, MESSAGES.INVALID_DATA);
    }

    const userId = req.user.usuario_id;
    const recipeId = req.params.id;
    const recipe = validation.data;

    try {
      await recipeService.updateRecipe(userId, recipeId, recipe);

      return successResponse(res, 200, MESSAGES.RECIPE_UPDATED, {
        id: recipeId,
        updated: true,
      });
    } catch (error) {
      if (error.statusCode === 404) {
        return errorResponse(res, 404, MESSAGES.RECIPE_NOT_FOUND);
      }
      return errorResponse(res, 500, MESSAGES.INTERNAL_ERROR);
    }
  }

  /**
   * DELETE /api/recipes/:id
   * Eliminamos una de las recetas del usuario por su id
   */

  static async deleteRecipe(req, res) {
    const userId = req.user.usuario_id;
    const recipeId = req.params.id;

    try {
      await recipeService.deleteRecipe(userId, recipeId);

      return successResponse(res, 200, MESSAGES.RECIPE_DELETED);
    } catch (error) {
      if (error.statusCode === 404) {
        return errorResponse(res, 404, MESSAGES.RECIPE_NOT_FOUND);
      }
      return errorResponse(res, 500, MESSAGES.INTERNAL_ERROR);
    }
  }
}
