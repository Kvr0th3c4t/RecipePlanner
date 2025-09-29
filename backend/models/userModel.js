import connection from "../config/database.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

export class userModel {
  static async createUser({ username, email, contraseña }) {
    try {
      console.log("=== INICIO CREATE USER ===");
      console.log("Email a verificar:", email);
      const existingUser = await this.findByEmail({ email });
      console.log("Usuario existente encontrado:", existingUser);
      const [uuidResult] = await connection.query("SELECT UUID() uuid;");
      const [{ uuid }] = uuidResult;
      console.log("UUID generado:", uuid);

      const hashedPassword = await bcrypt.hash(contraseña, 10);
      if (!existingUser) {
        if (!(await this.findByEmail({ email }))) {
          try {
            console.log("Insertando usuario...");
            await connection.query(
              `INSERT INTO usuarios (usuario_id, username, email, contraseña) VALUES (UUID_TO_BIN("${uuid}"),?, ?, ?)`,
              [username, email, hashedPassword]
            );
            console.log("Insert completado");

            console.log("Buscando usuario creado...");
            const [userResult] = await connection.query(
              `SELECT BIN_TO_UUID(usuario_id) as usuario_id, username, email 
                     FROM usuarios WHERE usuario_id = UUID_TO_BIN("${uuid}")`
            );
            console.log("Resultado del SELECT:", userResult);
            console.log("Primer elemento:", userResult[0]);

            return userResult[0];
          } catch (error) {
            console.log("Error en insert:", error);
            throw new Error("Error al crear el usuario");
          }
        } else {
          throw new Error("El usuario ya existe");
        }
      } else {
        console.log("DEBERÍA LANZAR ERROR - Usuario ya existe");
        throw new Error("El usuario ya existe");
      }
    } catch (error) {
      console.log("Error general:", error);
      throw error;
    }
  }

  static async findByEmail({ email }) {
    const [users] = await connection.query(
      "SELECT BIN_TO_UUID(usuario_id) as usuario_id, username, email, contraseña FROM usuarios WHERE email = ?",
      [email]
    );

    return users.length > 0 ? users[0] : null;
  }
}
