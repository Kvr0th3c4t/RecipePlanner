import connection from "../config/database.js";

export class ingredientModel {
  static async findIngredientByName(texto) {
    try {
      const [ingredient] = await connection.query(
        "SELECT ingrediente_id, ingrediente_nombre FROM ingredientes WHERE ingrediente_nombre LIKE ? LIMIT 5",
        [`%${texto}%`]
      );
      return ingredient;
    } catch (error) {
      throw new Error(
        "No se encuentran ingredientes con esos parámetros de búsqueda"
      );
    }
  }
  static async addIngredientToRecipe(
    receta_id,
    ingrediente_id,
    cantidad,
    unidad_id
  ) {
    try {
      const [ingredient] = await connection.query(
        "INSERT INTO receta_ingredientes (ingrediente_id, cantidad, unidad_id, receta_id) VALUES (?, ? , ?, ?)",
        [ingrediente_id, cantidad, unidad_id, receta_id]
      );
      return ingredient;
    } catch (error) {
      throw new Error("Error al añadir ingrediente");
    }
  }
  static async findIngredientById(id) {
    try {
      const [ingrediente] = await connection.query(
        "SELECT * FROM ingredientes WHERE ingrediente_id = ?",
        [id]
      );
      return ingrediente;
    } catch (error) {
      throw new Error("Ingrediente no encontrado");
    }
  }
  static async findUnitById(id) {
    try {
      const [unidad] = await connection.query(
        "SELECT * FROM unidades_medida WHERE unidad_id = ?",
        [id]
      );
      return unidad;
    } catch (error) {
      throw new Error("Unidad no encontrada");
    }
  }
  static async checkIngredientInRecipe(receta_id, ingrediente_id) {
    try {
      const [receta] = await connection.query(
        "SELECT * FROM receta_ingredientes WHERE receta_id = ? AND ingrediente_id = ?",
        [receta_id, ingrediente_id]
      );
      return receta;
    } catch (error) {
      throw new Error("Error al verificar ingrediente en receta");
    }
  }

  static async getIngredientDetail(receta_id, usuario_id) {
    try {
      const [ingredients] = await connection.query(
        `SELECT 
        receta_nombre, 
        receta_foto, 
        ingredientes.ingrediente_id,
        ingrediente_nombre, 
        cantidad, 
        unidades_medida.unidad_id,
        medida_nombre, 
        abreviatura,
        categorias_ingredientes.categoria_id,
        categoria_nombre
      FROM recetas
      JOIN receta_ingredientes ON recetas.receta_id = receta_ingredientes.receta_id
      JOIN ingredientes ON receta_ingredientes.ingrediente_id = ingredientes.ingrediente_id
      JOIN unidades_medida ON receta_ingredientes.unidad_id = unidades_medida.unidad_id
      JOIN categorias_ingredientes ON ingredientes.categoria_id = categorias_ingredientes.categoria_id
      WHERE recetas.receta_id = ? AND recetas.usuario_id = UUID_TO_BIN(?)`,
        [receta_id, usuario_id]
      );
      return ingredients;
    } catch (error) {
      throw new Error("Error al obtener detalles de la receta");
    }
  }

  static async deleteIngredient(receta_id, ingrediente_id) {
    const ingredientExists = await this.checkIngredientInRecipe(
      receta_id,
      ingrediente_id
    );

    if (ingredientExists.length === 0) {
      throw new Error("El ingrediente no está en esta receta");
    } else {
      try {
        await connection.query(
          "DELETE FROM receta_ingredientes WHERE receta_id = ? AND ingrediente_id = ?",
          [receta_id, ingrediente_id]
        );
      } catch (error) {
        throw new Error("Error al eliminar el ingrediente");
      }
    }
  }

  static async updateIngredient(
    receta_id,
    ingrediente_id,
    cantidad,
    unidad_id
  ) {
    try {
      await connection.query(
        "UPDATE receta_ingredientes SET cantidad = ?, unidad_id = ? WHERE ingrediente_id = ? AND receta_id = ?",
        [cantidad, unidad_id, ingrediente_id, receta_id]
      );
    } catch (error) {
      throw new Error("Error al actualizar el ingrediente");
    }
  }
}
