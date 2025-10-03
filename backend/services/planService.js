import { planModel } from "../models/planModel.js";
import { recipeModel } from "../models/recipeModel.js";
import { PLANNING } from "../constants/planning.js";

/**
 * Obtiene la planificación semanal del usuario
 * @param {string} userId - ID del usuario
 * @returns {Promise<Object>} Grid de planificación con estructura día -> tipo_comida
 */

export const getUserPlan = async (userId) => {
  const grid = PLANNING.DAYS.reduce((grid, dia) => {
    grid[dia] = PLANNING.MEAL_TYPE.reduce((comidas, tipo) => {
      comidas[tipo] = null;
      return comidas;
    }, {});
    return grid;
  }, {});

  const gridValues = await planModel.getPlan(userId);

  gridValues.forEach((item) => {
    grid[item.day][item.tipo_comida] = {
      receta_id: item.receta_id,
      receta_nombre: item.receta_nombre,
    };
  });

  return grid;
};

/**
 *
 * @param {String} userId - Id del usuario de la receta
 * @param {Object} recipeData - Id de la receta, dia y tipo de comida
 * @returns {Promise<boolean>} - True si se asignó correctamente
 */

export const assignRecipeToPlan = async (userId, recipeData) => {
  const { receta_id, day, tipo_comida } = recipeData;

  const recipeUser = await recipeModel.findRecipeByUser(receta_id, userId);

  if (recipeUser.length === 0) {
    const error = new Error("Receta no encontrada");
    error.statusCode = 404;
    throw error;
  }

  await planModel.asignRecipeToPlan(userId, receta_id, day, tipo_comida);
  return true;
};

/**
 *
 * @param {String} userId - Id del usuario de la receta
 * @param {Object} planData - Dia donde está asignada la receta
 * @returns {Promise<void>} La función no devuelve nada
 */
export const removeRecipeFromPlan = async (userId, planData) => {
  const { day, tipo_comida } = planData;

  const recipeExists = await planModel.recipeExists(userId, day, tipo_comida);

  if (recipeExists.length === 0) {
    const error = new Error("Receta no encontrada");
    error.statusCode = 404;
    throw error;
  }
  await planModel.deleteRecipe(userId, day, tipo_comida);
};

/**
 *
 * @param {String} userId - Id el usuario de la receta
 * @returns {Promise<Object>} - Retorna un array con la lista de objetos de ingredientes ordenados por categorías
 */

export const getShoppingList = async (userId) => {
  const shoppingListData = await planModel.getShoppingList(userId);

  if (shoppingListData.length === 0) {
    return { categorias: [] };
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

  return { categorias };
};
