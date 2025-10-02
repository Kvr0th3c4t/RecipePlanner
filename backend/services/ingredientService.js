import { ingredientModel } from "../models/ingredientModel.js";
import { recipeModel } from "../models/recipeModel.js";
import { unitModel } from "../models/unitModel.js";

/**
 * Busca ingredientes por nombre
 * @param {string} ingredientName - Nombre del ingrediente a buscar
 * @returns {Promise<Array>} Array de ingredientes encontrados (vacío si no hay resultados)
 */
export const searchIngredients = async (ingredientName) => {
  const cleanIngredient = ingredientName.trim();

  if (!cleanIngredient) {
    return [];
  }

  const result = await ingredientModel.findIngredientByName(cleanIngredient);

  return result;
};

/**
 * Añade ingredientes a una receta
 * @param {string} usuario_id - Id del usuario que agrega el ingrediente
 * @param {string} receta_id - Id de la receta donde se va a añadir los ingredientes
 * @param {Object} ingredientData - Datos del ingrediente que se va a añadir
 *
 * @returns {Promise<Object>} Objeto con datos del ingrediente añadido
 */

export const addIngredientToRecipe = async (
  usuario_id,
  receta_id,
  ingredientData
) => {
  const { ingrediente_id, cantidad, unidad_id } = ingredientData;

  const existingRecipe = await recipeModel.findRecipeByUser(
    receta_id,
    usuario_id
  );

  if (existingRecipe.length === 0) {
    const error = new Error("La receta no existe");
    error.statusCode = 404;
    throw error;
  }

  const existingIngredient = await ingredientModel.findIngredientById(
    ingrediente_id
  );

  if (existingIngredient.length === 0) {
    const error = new Error("El ingrediente no existe");
    error.statusCode = 404;
    throw error;
  }

  const existingUnit = await ingredientModel.findUnitById(unidad_id);
  if (existingUnit.length === 0) {
    const error = new Error("La unidad no existe");
    error.statusCode = 404;
    throw error;
  }
  const ingredientExistInrecipe = await ingredientModel.checkIngredientInRecipe(
    receta_id,
    ingrediente_id
  );
  if (ingredientExistInrecipe.length > 0) {
    const error = new Error("El ingrediente ya existe en la receta");
    error.statusCode = 409;
    throw error;
  }
  await ingredientModel.addIngredientToRecipe(
    receta_id,
    ingrediente_id,
    cantidad,
    unidad_id
  );
  return true;
};

/**
 * Elimina un ingrediente de una receta
 * @param {string} userId - ID del usuario
 * @param {string} recipeId - ID de la receta
 * @param {string} ingredientId - ID del ingrediente a eliminar
 * @returns {Promise<void>} No retorna datos
 */
export const deleteRecipeIngredient = async (
  userId,
  recipeId,
  ingredientId
) => {
  const existingRecipe = await recipeModel.findRecipeByUser(recipeId, userId);
  if (existingRecipe.length === 0) {
    const error = new Error("Receta no encontrada");
    error.statusCode = 404;
    throw error;
  }

  try {
    await ingredientModel.deleteIngredient(recipeId, ingredientId);
  } catch (error) {
    if (error.message === "Ingrediente no encontrado en la receta") {
      const notFoundError = new Error("Ingrediente no encontrado en la receta");
      notFoundError.statusCode = 404;
      throw notFoundError;
    }
    throw error;
  }
};
