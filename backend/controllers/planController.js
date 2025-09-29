import { planModel } from "../models/planModel.js";
import { errorResponse, successResponse } from "../utils/responseHelper.js";
import { MESSAGES } from "../constants/messages.js";
import { PLANNING } from "../constants/planning.js";
import { recipeModel } from "../models/recipeModel.js";
import { validatePlan } from "../schemas/planSchema.js";

export class planController {
  static async getPlan(req, res) {
    const userId = req.user.usuario_id;

    try {
      const planValues = await planModel.getPlan(userId);

      const emptyGrid = PLANNING.DAYS.reduce((grid, dia) => {
        grid[dia] = PLANNING.MEAL_TYPE.reduce((comidas, tipo) => {
          comidas[tipo] = null;
          return comidas;
        }, {});
        return grid;
      }, {});

      planValues.forEach((item) => {
        emptyGrid[item.day][item.tipo_comida] = {
          receta_id: item.receta_id,
          receta_nombre: item.receta_nombre,
        };
      });

      return successResponse(res, 200, MESSAGES.PLAN_RETRIEVED, emptyGrid);
    } catch (error) {
      return errorResponse(res, 500, MESSAGES.INTERNAL_ERROR);
    }
  }

  static async asignRecipeToPlan(req, res) {
    const userId = req.user.usuario_id;
    const recipeValues = req.body;

    const validatedValues = validatePlan(recipeValues);

    if (!validatedValues.success) {
      return errorResponse(res, 500, MESSAGES.INVALID_DATA);
    }

    try {
      const recipeUser = await recipeModel.findRecipeByUser(
        validatedValues.data.receta_id,
        userId
      );

      if (recipeUser.length === 0) {
        return errorResponse(res, 404, MESSAGES.RECIPE_NOT_FOUND);
      }
      await planModel.asignRecipeToPlan(
        userId,
        validatedValues.data.receta_id,
        validatedValues.data.day,
        validatedValues.data.tipo_comida
      );
      return successResponse(res, 201, MESSAGES.ASSIGNEMENT_ADDED);
    } catch (error) {
      return errorResponse(res, 500, MESSAGES.INTERNAL_ERROR);
    }
  }

  static async deleteRecipe(req, res) {
    const userId = req.user.usuario_id;
    const recipeValues = req.body;
    const validatedvalues = validatePlan(recipeValues);

    if (!validatedvalues.success) {
      return errorResponse(res, 500, MESSAGES.INVALID_DATA);
    }
    try {
      const recipeExists = await planModel.recipeExists(
        userId,
        validatedvalues.data.day,
        validatedvalues.data.tipo_comida
      );

      if (recipeExists.length === 0) {
        return errorResponse(res, 404, MESSAGES.ASSIGNEMENT_NOT_FOUND);
      } else {
        await planModel.deleteRecipe(
          userId,
          validatedvalues.data.day,
          validatedvalues.data.tipo_comida
        );

        return successResponse(res, 200, MESSAGES.ASSIGNEMENT_DELETED);
      }
    } catch (error) {
      return errorResponse(res, 500, MESSAGES.INTERNAL_ERROR);
    }
  }

  static async getShoppingList(req, res) {
    const userId = req.user.usuario_id;

    try {
      const shoppingListData = await planModel.getShoppingList(userId); // ← Sin destructuring

      if (shoppingListData.length === 0) {
        return successResponse(
          res,
          200,
          "No hay ingredientes en la planificación",
          {
            categorias: [],
          }
        );
      }

      const groupedByCategory = shoppingListData.reduce((acc, item) => {
        const categoria = item.categoria_nombre;

        if (!acc[categoria]) {
          acc[categoria] = [];
        }

        acc[categoria].push({
          ingrediente_id: item.ingrediente_id,
          nombre: item.ingrediente_nombre,
          cantidad: item.cantidad_total,
          unidad: item.medida_nombre,
        });

        return acc;
      }, {});

      const categorias = Object.entries(groupedByCategory).map(
        ([nombre, ingredientes]) => ({
          categoria_nombre: nombre,
          ingredientes: ingredientes,
        })
      );

      return successResponse(res, 200, "Lista de compras generada", {
        categorias: categorias,
      });
    } catch (error) {
      return errorResponse(res, 500, MESSAGES.INTERNAL_ERROR);
    }
  }
}
