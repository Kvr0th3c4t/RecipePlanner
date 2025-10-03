import connection from "../config/database.js";

export class planModel {
  static async getPlan(usuario_id) {
    try {
      const [planValues] = await connection.query(
        "SELECT planificacion.receta_id, day, tipo_comida, receta_nombre from planificacion JOIN recetas ON planificacion.receta_id = recetas.receta_id WHERE planificacion.usuario_id = UUID_TO_BIN(?)",
        [usuario_id]
      );
      return planValues;
    } catch (error) {
      throw new Error("Error al recuperar la planificación");
    }
  }

  static async asignRecipeToPlan(usuario_id, receta_id, day, tipo_comida) {
    try {
      const recipe = await connection.query(
        "INSERT INTO planificacion (usuario_id, receta_id, day, tipo_comida) VALUES (UUID_TO_BIN(?), ?, ?, ?) ON DUPLICATE KEY UPDATE receta_id = VALUES(receta_id)",
        [usuario_id, receta_id, day, tipo_comida]
      );
      return recipe;
    } catch (error) {
      throw new Error("Error al insertar la asignación");
    }
  }

  static async recipeExists(usuario_id, day, tipo_comida) {
    try {
      const [recipe] = await connection.query(
        "SELECT id FROM planificacion WHERE usuario_id = UUID_TO_BIN(?) AND day = ? AND tipo_comida = ? AND receta_id IS NOT NULL",
        [usuario_id, day, tipo_comida]
      );
      return recipe;
    } catch (error) {
      throw new Error("Error al buscar la asignación");
    }
  }

  static async deleteRecipe(usuario_id, day, tipo_comida) {
    try {
      const [result] = await connection.query(
        "UPDATE planificacion SET receta_id = null WHERE usuario_id = UUID_TO_BIN(?) AND day = ? AND tipo_comida = ?",
        [usuario_id, day, tipo_comida]
      );

      return result;
    } catch (error) {
      throw new Error("Error al modificar la asignación");
    }
  }

  static async getShoppingList(usuario_id) {
    try {
      const [shoppingListData] = await connection.query(
        `SELECT 
                i.ingrediente_id,
                i.ingrediente_nombre,
                SUM(ri.cantidad) as cantidad_total,
                ri.unidad_id,
                u.medida_nombre,
                c.categoria_id,
                c.categoria_nombre
            FROM planificacion p
            JOIN recetas r ON p.receta_id = r.receta_id  
            JOIN receta_ingredientes ri ON r.receta_id = ri.receta_id
            JOIN ingredientes i ON ri.ingrediente_id = i.ingrediente_id
            JOIN unidades_medida u ON ri.unidad_id = u.unidad_id
            JOIN categorias_ingredientes c ON i.categoria_id = c.categoria_id
            WHERE p.usuario_id = UUID_TO_BIN(?) AND p.receta_id IS NOT NULL
            GROUP BY i.ingrediente_id, ri.unidad_id, c.categoria_id
            ORDER BY c.categoria_nombre ASC, i.ingrediente_nombre ASC`,
        [usuario_id]
      );

      return shoppingListData;
    } catch (error) {
      throw new Error("Error al consultar la lista de compras");
    }
  }
}
