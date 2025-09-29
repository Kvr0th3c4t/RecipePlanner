import { MESSAGES } from "../constants/messages.js";
import { ingredientModel } from "../models/ingredientModel.js";
import { recipeModel } from "../models/recipeModel.js";
import { userModel } from "../models/UserModel.js";
import {
  validateIngredient,
  validateUpdateIngredient,
} from "../schemas/ingredientSchema.js";
import { errorResponse, successResponse } from "../utils/responseHelper.js";

export class ingredientController {
  static async findIngredientByName(req, res) {
    if (req.query.q) {
      const texto = req.query.q.trim();
      if (texto) {
        try {
          const ingredient = await ingredientModel.findIngredientByName(texto);
          if (ingredient.length > 0) {
            return successResponse(res, 200, MESSAGES.INGREDIENT_FOUND, {
              ingredient: ingredient,
            });
          } else {
            return successResponse(res, 200, "Sin resultados", {
              ingredient,
            });
          }
        } catch (error) {
          return errorResponse(res, 500, MESSAGES.INTERNAL_ERROR);
        }
      } else {
        return successResponse(res, 200, "Sin resultados", {
          ingredient: [],
        });
      }
    } else {
      return successResponse(res, 200, "Sin resultados", {
        ingredient: [],
      });
    }
  }

  static async addIngredientToRecipe(req, res) {
    const ingredientValues = req.body;
    const recipeId = req.params.id;
    const userId = req.user.usuario_id;

    const ingrediente_id = ingredientValues.ingrediente_id;
    const cantidad = ingredientValues.cantidad;
    const unidad_id = ingredientValues.unidad_id;

    const validatedData = validateIngredient({
      ingrediente_id: ingrediente_id,
      cantidad: cantidad,
      unidad_id: unidad_id,
    });

    if (!validatedData.success) {
      return errorResponse(res, 400, MESSAGES.INVALID_DATA);
    }

    const recipeAndUser = await recipeModel.findRecipeByUser(recipeId, userId);

    if (recipeAndUser.length === 0) {
      return errorResponse(res, 404, MESSAGES.NO_RECIPES);
    }

    const validIngredient = await ingredientModel.findIngredientById(
      ingrediente_id
    );
    if (validIngredient.length === 0) {
      return errorResponse(res, 404, MESSAGES.INGREDIENT_NOT_FOUND);
    }

    const validUnit = await ingredientModel.findUnitById(unidad_id);
    if (validUnit.length === 0) {
      return errorResponse(res, 404, MESSAGES.UNIT_NOT_FOUND);
    }
    const ingredientInRecipe = await ingredientModel.checkIngredientInRecipe(
      recipeId,
      ingrediente_id
    );
    if (ingredientInRecipe.length > 0) {
      return errorResponse(res, 409, MESSAGES.INGREDIENT_IN_USE);
    }

    try {
      const newIngredient = await ingredientModel.addIngredientToRecipe(
        recipeId,
        ingrediente_id,
        cantidad,
        unidad_id
      );
      if (newIngredient) {
        return successResponse(res, 201, MESSAGES.INGREDIENT_ADDED);
      } else {
        return errorResponse(res, 500, MESSAGES.DATABASE_ERROR);
      }
    } catch (error) {
      return errorResponse(res, 500, MESSAGES.INTERNAL_ERROR);
    }
  }

  static async getIngredientDetail(req, res) {
    const userId = req.user.usuario_id;
    const recetaID = req.params.id;

    try {
      const recipeExists = await recipeModel.findRecipeByUser(recetaID, userId);

      if (recipeExists.length === 0) {
        return errorResponse(res, 404, MESSAGES.NO_RECIPES);
      }

      const ingredientsArray = await ingredientModel.getIngredientDetail(
        recetaID,
        userId
      );

      if (ingredientsArray.length === 0) {
        return successResponse(res, 200, MESSAGES.NO_INGREDIENTS, {
          receta: {},
          ingredientes: [],
        });
      }

      const recetaInfo = {
        recetaNombre: ingredientsArray[0].receta_nombre,
        recetaFoto: ingredientsArray[0].receta_foto,
      };

      const ingredientesLimpios = ingredientsArray.map((item) => ({
        ingrediente_id: item.ingrediente_id,
        nombreIngrediente: item.ingrediente_nombre,
        unidad_id: item.unidad_id,
        cantidad: item.cantidad,
        medida: item.medida_nombre,
        categoria_id: item.categoria_id,
        categoria: item.categoria_nombre,
        abreviatura: item.abreviatura,
      }));

      return successResponse(res, 200, MESSAGES.RECIPE_RETRIEVED, {
        receta: recetaInfo,
        ingredientes: ingredientesLimpios,
      });
    } catch (error) {
      return errorResponse(res, 500, MESSAGES.INTERNAL_ERROR);
    }
  }

  static async deleteIngredient(req, res) {
    const recipeId = req.params.id;
    const ingredientId = req.params.ingredientId;
    const userId = req.user.usuario_id;

    try {
      const recipeExists = await recipeModel.findRecipeByUser(recipeId, userId);

      if (recipeExists.length === 0) {
        return errorResponse(res, 404, MESSAGES.NO_RECIPES);
      }

      const ingredientExists = await ingredientModel.checkIngredientInRecipe(
        recipeId,
        ingredientId
      );

      if (ingredientExists.length === 0) {
        return errorResponse(res, 404, MESSAGES.INGREDIENT_NOT_FOUND);
      }

      await ingredientModel.deleteIngredient(recipeId, ingredientId);

      return successResponse(res, 200, MESSAGES.INGREDIENT_DELETED);
    } catch (error) {
      return errorResponse(res, 500, MESSAGES.INTERNAL_ERROR);
    }
  }

  static async updateIngredient(req, res) {
    const recipeId = req.params.id;
    const ingredientId = req.params.ingredientId;
    const userId = req.user.usuario_id;
    const updateValues = req.body;
    const validatedValues = validateUpdateIngredient(updateValues);

    if (!validatedValues.success) {
      return errorResponse(res, 400, MESSAGES.INVALID_DATA);
    }

    try {
      const recipeExists = await recipeModel.findRecipeByUser(recipeId, userId);
      const ingredientExists = await ingredientModel.checkIngredientInRecipe(
        recipeId,
        ingredientId
      );

      if (recipeExists.length === 0) {
        return errorResponse(res, 404, MESSAGES.NO_RECIPES);
      }
      if (ingredientExists.length === 0) {
        return errorResponse(res, 404, MESSAGES.INGREDIENT_NOT_FOUND);
      }

      await ingredientModel.updateIngredient(
        recipeId,
        ingredientId,
        updateValues.cantidad,
        updateValues.unidad_id
      );

      return successResponse(res, 200, MESSAGES.INGREDIENT_UPDATED);
    } catch (error) {
      return errorResponse(res, 500, MESSAGES.INTERNAL_ERROR);
    }
  }
}
