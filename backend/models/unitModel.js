import connection from "../config/database.js";

export class unitModel {
  static async getAllUnits() {
    try {
      const [units] = await connection.query(
        "SELECT unidad_id, medida_nombre, abreviatura FROM unidades_medida ORDER BY medida_nombre"
      );
      return units;
    } catch (error) {
      throw new Error("Error al obtener las unidades de medida");
    }
  }
}
