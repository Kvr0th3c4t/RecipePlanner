import { recipeModel } from "../models/recipeModel.js";
import { validateRecipe } from "../schemas/recipeSchema.js";
import { successResponse, errorResponse } from "../utils/responseHelper.js";
import { MESSAGES } from "../constants/messages.js";

export class recipeController {
  static async insertRecipe(req, res) {
    const recipe = validateRecipe(req.body);

    if (!recipe.success) {
      return errorResponse(res, 400, MESSAGES.INVALID_DATA);
    }

    const userId = req.user.usuario_id;
    const receta_nombre = recipe.data.receta_nombre;
    const receta_foto =
      recipe.data.receta_foto ||
      "https://placehold.co/600x400/00786F/FFF?text=Añade una foto a tu receta";

    try {
      const newRecipe = await recipeModel.insertRecipe({
        usuario_id: userId,
        receta_nombre: receta_nombre,
        receta_foto: receta_foto,
      });

      return successResponse(res, 201, MESSAGES.RECIPE_CREATED, {
        recipe: newRecipe,
      });
    } catch (error) {
      return errorResponse(res, 500, MESSAGES.INTERNAL_ERROR);
    }
  }

  static async getAllRecipes(req, res) {
    const userId = req.user.usuario_id;

    try {
      const recipeArray = await recipeModel.getAllRecipes(userId);

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

  static async getFilteredRecipes(req, res) {
    const userId = req.user.usuario_id;
    const { searchType, searchTerm = "", page = 1, limit = 10 } = req.query;

    try {
      let result;

      if (searchType === "recipe") {
        result = await recipeModel.getByRecipeName(
          userId,
          searchTerm,
          page,
          limit
        );
      } else if (searchType === "ingredient") {
        result = await recipeModel.getByIngredients(
          userId,
          searchTerm,
          page,
          limit
        );
      } else {
        return errorResponse(res, 400, MESSAGES.DATABASE_ERROR);
      }

      return successResponse(res, 200, MESSAGES.RECIPES_RETRIEVED, result);
    } catch (error) {
      return errorResponse(res, 500, MESSAGES.INTERNAL_ERROR);
    }
  }

  static async getRecipe(req, res) {
    const userId = req.user.usuario_id;
    const recetaID = req.params.id;

    try {
      const ingredientsArray = await recipeModel.getRecipe(recetaID, userId);

      if (ingredientsArray.length === 0) {
        const recipeExists = await recipeModel.findRecipeByUser(
          recetaID,
          userId
        );

        if (recipeExists.length === 0) {
          return errorResponse(res, 404, MESSAGES.RECIPE_NOT_FOUND);
        }

        return successResponse(res, 200, MESSAGES.RECIPE_RETRIEVED, {
          receta: {
            recetaNombre: recipeExists[0].receta_nombre,
            recetaFoto: recipeExists[0].receta_foto,
          },
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
        cantidad: item.cantidad,
        unidad_id: item.unidad_id,
        medida: item.medida_nombre,
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

  static async updateRecipe(req, res) {
    const recipeValid = validateRecipe(req.body);

    if (!recipeValid.success) {
      return errorResponse(res, 400, MESSAGES.INVALID_DATA);
    }

    const userId = req.user.usuario_id;
    const recipeId = req.params.id;
    const recipe = {
      receta_nombre: recipeValid.data.receta_nombre,
      receta_foto: recipeValid.data.receta_foto,
    };

    try {
      await recipeModel.updateRecipe(userId, recipeId, { recipe });

      return successResponse(res, 200, MESSAGES.RECIPE_UPDATED, {
        id: recipeId,
        updated: true,
      });
    } catch (error) {
      if (error.message === "Receta no encontrada") {
        return errorResponse(res, 404, MESSAGES.RECIPE_NOT_FOUND);
      }
      return errorResponse(res, 500, MESSAGES.INTERNAL_ERROR);
    }
  }

  static async deleteRecipe(req, res) {
    const userId = req.user.usuario_id;
    const recipeId = req.params.id;

    try {
      await recipeModel.deleteRecipe(userId, recipeId);

      return successResponse(res, 200, MESSAGES.RECIPE_DELETED);
    } catch (error) {
      if (error.message === "Receta no encontrada") {
        return errorResponse(res, 404, MESSAGES.RECIPE_NOT_FOUND);
      }
      return errorResponse(res, 500, MESSAGES.INTERNAL_ERROR);
    }
  }
}
