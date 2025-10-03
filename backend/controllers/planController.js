import * as planService from "../services/planService.js";
import { errorResponse, successResponse } from "../utils/responseHelper.js";
import { MESSAGES } from "../constants/messages.js";
import { validatePlan } from "../schemas/planSchema.js";

export class planController {
  /**
   * GET /api/planning
   * Obtenemos el planning de un usuario
   */
  static async getPlan(req, res) {
    const userId = req.user.usuario_id;

    try {
      const grid = await planService.getUserPlan(userId);
      return successResponse(res, 200, MESSAGES.PLAN_RETRIEVED, grid);
    } catch (error) {
      return errorResponse(res, 500, MESSAGES.INTERNAL_ERROR);
    }
  }

  /**
   * POST /api/planning/asignRecipe
   * Asignamos una receta al planning de un usuario
   */

  static async asignRecipeToPlan(req, res) {
    const userId = req.user.usuario_id;
    const recipeValues = req.body;

    const validatedValues = validatePlan(recipeValues);

    if (!validatedValues.success) {
      return errorResponse(res, 400, MESSAGES.INVALID_DATA);
    }

    try {
      await planService.assignRecipeToPlan(userId, validatedValues.data);
      return successResponse(res, 201, MESSAGES.ASSIGNEMENT_ADDED);
    } catch (error) {
      if (error.statusCode === 404) {
        return errorResponse(res, 404, error.message);
      }
      return errorResponse(res, 500, MESSAGES.INTERNAL_ERROR);
    }
  }

  /**
   * POST /api/planning/deleteRecipe
   * Asignamos una receta con contenio vacio al planning de un usuario
   */

  static async deleteRecipe(req, res) {
    const userId = req.user.usuario_id;
    const recipeValues = req.body;
    const validatedvalues = validatePlan(recipeValues);

    if (!validatedvalues.success) {
      return errorResponse(res, 400, MESSAGES.INVALID_DATA);
    }
    try {
      await planService.removeRecipeFromPlan(userId, validatedvalues.data);

      return successResponse(res, 200, MESSAGES.ASSIGNEMENT_DELETED);
    } catch (error) {
      if (error.statusCode === 404) {
        return errorResponse(res, 404, error.message);
      }
      return errorResponse(res, 500, MESSAGES.INTERNAL_ERROR);
    }
  }
  /**
   * GET /api/planning/shopping-list
   * Asignamos una receta con contenio vacio al planning de un usuario
   */
  static async getShoppingList(req, res) {
    const userId = req.user.usuario_id;

    try {
      const shoppingList = await planService.getShoppingList(userId);

      return successResponse(
        res,
        200,
        "Lista de compras generada",
        shoppingList
      );
    } catch (error) {
      return errorResponse(res, 500, MESSAGES.INTERNAL_ERROR);
    }
  }
}
