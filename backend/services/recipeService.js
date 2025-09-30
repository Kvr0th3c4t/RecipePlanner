import { recipeModel } from "../models/recipeModel.js";

const DEFAULT_RECIPE_PHOTO =
  "https://placehold.co/600x400/00786F/FFF?text=Añade una foto a tu receta";

/**
 * Crea una nueva receta para un usuario
 * @param {string} userId - ID del usuario (UUID formato string)
 * @param {Object} recipeData - Datos de la receta (receta_nombre, receta_foto opcional)
 * @returns {Promise<Object>} Receta creada con su ID
 */
export const createRecipe = async (userId, recipeData) => {
  const { receta_nombre, receta_foto } = recipeData;

  const finalPhoto = receta_foto || DEFAULT_RECIPE_PHOTO;

  const newRecipe = await recipeModel.insertRecipe({
    usuario_id: userId,
    receta_nombre,
    receta_foto: finalPhoto,
  });

  return newRecipe;
};

/**
 * Obtiene todas las recetas de un usuario
 * @param {string} userId - ID del usuario (UUID formato string)
 * @returns {Promise<Array>} Array de recetas del usuario
 */
export const getAllUserRecipes = async (userId) => {
  const recipeArray = await recipeModel.getAllRecipes(userId);

  return recipeArray;
};

/**
 * Busca recetas por nombre o por ingrediente con paginación
 * @param {string} userId - ID del usuario (UUID formato string)
 * @param {Object} filters - Filtros de búsqueda (searchType, searchTerm, page, limit)
 * @returns {Promise<Object>} Objeto con recetas, total, página actual y total de páginas
 */
export const searchRecipes = async (userId, filters) => {
  const { searchType, searchTerm = "", page = 1, limit = 10 } = filters;

  if (searchType === "recipe") {
    const recipeArray = await recipeModel.getByRecipeName(
      userId,
      searchTerm,
      page,
      limit
    );
    return recipeArray;
  } else if (searchType === "ingredient") {
    const recipeArray = await recipeModel.getByIngredients(
      userId,
      searchTerm,
      page,
      limit
    );
    return recipeArray;
  } else {
    const error = new Error("Tipo de búsqueda no válido");
    error.statusCode = 400;
    throw error;
  }
};

/**
 * Obtiene el detalle completo de una receta con sus ingredientes
 * @param {string} userId - ID del usuario (UUID formato string)
 * @param {string} recipeId - ID de la receta
 * @returns {Promise<Object>} Objeto con información de la receta e ingredientes transformados
 */
export const getRecipeDetail = async (userId, recipeId) => {
  const ingredientsArray = await recipeModel.getRecipe(recipeId, userId);

  if (ingredientsArray.length === 0) {
    const existingRecipe = await recipeModel.findRecipeByUser(recipeId, userId);

    if (existingRecipe.length === 0) {
      const error = new Error("La receta no existe");
      error.statusCode = 404;
      throw error;
    } else {
      return {
        receta: {
          recetaNombre: existingRecipe[0].receta_nombre,
          recetaFoto: existingRecipe[0].receta_foto,
        },
        ingredientes: [],
      };
    }
  } else {
    const recetaInfo = {
      recetaNombre: ingredientsArray[0].receta_nombre,
      recetaFoto: ingredientsArray[0].receta_foto,
    };

    const filteredIngredients = ingredientsArray.map((ing) => ({
      ingrediente_id: ing.ingrediente_id,
      nombreIngrediente: ing.ingrediente_nombre,
      cantidad: ing.cantidad,
      unidad_id: ing.unidad_id,
      medida: ing.medida_nombre,
      categoria: ing.categoria_nombre,
      abreviatura: ing.abreviatura,
    }));
    return {
      receta: recetaInfo,
      ingredientes: filteredIngredients,
    };
  }
};

/**
 * Actualiza los datos de una receta existente
 * @param {string} userId - ID del usuario (UUID formato string)
 * @param {string} recipeId - ID de la receta a actualizar
 * @param {Object} recipeData - Nuevos datos de la receta (receta_nombre, receta_foto)
 * @returns {Promise<void>} No retorna datos, solo confirma la actualización
 */
export const updateRecipe = async (userId, recipeId, recipeData) => {
  const { receta_nombre, receta_foto } = recipeData;

  try {
    await recipeModel.updateRecipe(userId, recipeId, {
      recipe: { receta_nombre, receta_foto },
    });
  } catch (error) {
    if (error.message === "Receta no encontrada") {
      const notFoundError = new Error("Receta no encontrada");
      notFoundError.statusCode = 404;
      throw notFoundError;
    }
    throw error;
  }
};

/**
 * Elimina una receta del usuario
 * @param {string} userId - ID del usuario (UUID formato string)
 * @param {string} recipeId - ID de la receta a eliminar
 * @returns {Promise<void>} No retorna datos, solo confirma la eliminación
 */
export const deleteRecipe = async (userId, recipeId) => {
  try {
    await recipeModel.deleteRecipe(userId, recipeId);
  } catch (error) {
    if (error.message === "Receta no encontrada") {
      const notFoundError = new Error("Receta no encontrada");
      notFoundError.statusCode = 404;
      throw notFoundError;
    }
    throw error;
  }
};
