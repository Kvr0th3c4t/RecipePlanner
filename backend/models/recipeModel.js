import connection from "../config/database.js";

export class recipeModel {
  static async insertRecipe({ usuario_id, receta_nombre, receta_foto }) {
    try {
      const [result] = await connection.query(
        "INSERT INTO recetas (usuario_id, receta_nombre, receta_foto) VALUES (UUID_TO_BIN(?), ?, ?)",
        [usuario_id, receta_nombre, receta_foto]
      );

      return {
        receta_id: result.insertId,
        mensaje: "Receta creada correctamente",
      };
    } catch (error) {
      throw new Error("Error al crear la receta");
    }
  }

  static async getAllRecipes(usuario_id) {
    try {
      const [recipeArray] = await connection.query(
        `SELECT receta_id, receta_nombre, receta_foto FROM recetas WHERE usuario_id = UUID_TO_BIN(?)`,
        [usuario_id]
      );
      return recipeArray;
    } catch (error) {
      throw new Error("Error al consultar las recetas del usuario");
    }
  }

  static async getByRecipeName(
    usuario_id,
    searchTerm = "",
    page = 1,
    limit = 10
  ) {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;
    const searchPattern = `%${searchTerm}%`;

    try {
      const [recipeArray] = await connection.query(
        `SELECT receta_id, receta_nombre, receta_foto FROM recetas 
             WHERE usuario_id = UUID_TO_BIN(?) AND receta_nombre LIKE ? 
             LIMIT ? OFFSET ?`,
        [usuario_id, searchPattern, limitNum, offset]
      );

      const [countResult] = await connection.query(
        `SELECT COUNT(*) as total FROM recetas 
             WHERE usuario_id = UUID_TO_BIN(?) AND receta_nombre LIKE ?`,
        [usuario_id, searchPattern]
      );

      return {
        recipes: recipeArray,
        total: countResult[0].total,
        currentPage: pageNum,
        totalPages: Math.ceil(countResult[0].total / limitNum),
      };
    } catch (error) {
      throw new Error("Error al consultar las recetas del usuario");
    }
  }

  static async getByIngredients(
    usuario_id,
    searchTerm = "",
    page = 1,
    limit = 10
  ) {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;
    const searchPattern = `%${searchTerm}%`;

    try {
      const [recipeArray] = await connection.query(
        `SELECT DISTINCT r.receta_id, r.receta_nombre, r.receta_foto FROM recetas r
        JOIN receta_ingredientes i ON r.receta_id = i.receta_id
        JOIN ingredientes y ON i.ingrediente_id = y.ingrediente_id
       WHERE r.usuario_id = UUID_TO_BIN(?) AND y.ingrediente_nombre LIKE ? 
       LIMIT ? OFFSET ?`,
        [usuario_id, searchPattern, limitNum, offset]
      );

      const [countResult] = await connection.query(
        `SELECT COUNT(DISTINCT r.receta_id) as total 
          FROM recetas r
          JOIN receta_ingredientes ri ON r.receta_id = ri.receta_id
          JOIN ingredientes i ON ri.ingrediente_id = i.ingrediente_id
          WHERE r.usuario_id = UUID_TO_BIN(?) AND i.ingrediente_nombre LIKE ?`,
        [usuario_id, searchPattern]
      );

      return {
        recipes: recipeArray,
        total: countResult[0].total,
        currentPage: page,
        totalPages: Math.ceil(countResult[0].total / limit),
      };
    } catch (error) {
      throw new Error("Error al consultar las recetas del usuario");
    }
  }

  static async getRecipe(receta_id, usuario_id) {
    try {
      const [ingredientsArray] = await connection.query(
        `SELECT receta_nombre, receta_foto, cantidad, 
              receta_ingredientes.ingrediente_id,
              receta_ingredientes.unidad_id,
              ingrediente_nombre, medida_nombre, categoria_nombre, abreviatura
        FROM recetas
        JOIN receta_ingredientes ON recetas.receta_id = receta_ingredientes.receta_id
        JOIN ingredientes ON receta_ingredientes.ingrediente_id = ingredientes.ingrediente_id
        JOIN unidades_medida ON receta_ingredientes.unidad_id = unidades_medida.unidad_id
        JOIN categorias_ingredientes ON ingredientes.categoria_id = categorias_ingredientes.categoria_id
        WHERE recetas.receta_id = ? AND recetas.usuario_id = UUID_TO_BIN(?)`,
        [receta_id, usuario_id]
      );

      return ingredientsArray;
    } catch (error) {
      throw new Error("Error al consultar la receta del usuario");
    }
  }

  static async updateRecipe(usuario_id, receta_id, { recipe }) {
    const [recipeUser] = await connection.query(
      `SELECT receta_nombre, receta_foto FROM recetas WHERE usuario_id = UUID_TO_BIN(?) AND receta_id = ?`,
      [usuario_id, receta_id]
    );

    if (recipeUser.length === 0) {
      throw new Error("Receta no encontrada");
    } else {
      try {
        await connection.query(
          "UPDATE recetas SET receta_nombre = ?, receta_foto = ? WHERE receta_id = ?",
          [recipe.receta_nombre, recipe.receta_foto, receta_id]
        );
      } catch (error) {
        throw new Error("Error al actualizar la receta");
      }
    }
  }

  static async deleteRecipe(usuario_id, receta_id) {
    const [recipeUser] = await connection.query(
      `SELECT receta_nombre, receta_foto FROM recetas WHERE usuario_id = UUID_TO_BIN(?) AND receta_id = ?`,
      [usuario_id, receta_id]
    );

    if (recipeUser.length === 0) {
      throw new Error("Receta no encontrada");
    } else {
      try {
        await connection.query(
          "DELETE FROM recetas WHERE usuario_id = UUID_TO_BIN(?) AND receta_id = ?",
          [usuario_id, receta_id]
        );
      } catch (error) {
        throw new Error("Error al eliminar la receta");
      }
    }
  }

  static async findRecipeByUser(receta_id, usuario_id) {
    try {
      const [result] = await connection.query(
        "SELECT receta_id, receta_nombre, receta_foto FROM recetas WHERE receta_id = ? AND usuario_id = UUID_TO_BIN(?)",
        [receta_id, usuario_id]
      );
      return result;
    } catch (error) {
      throw new Error("Error al verificar propiedad de la receta");
    }
  }
}
