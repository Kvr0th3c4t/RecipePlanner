import connection from "../config/database.js";

export class userModel {
  static async createUser({ username, email, contraseña }) {
    const [uuidResult] = await connection.query("SELECT UUID() uuid;");
    const [{ uuid }] = uuidResult;

    await connection.query(
      `INSERT INTO usuarios (usuario_id, username, email, contraseña) VALUES (UUID_TO_BIN(?), ?, ?, ?)`,
      [uuid, username, email, contraseña]
    );

    const [userResult] = await connection.query(
      `SELECT BIN_TO_UUID(usuario_id) as usuario_id, username, email 
     FROM usuarios WHERE usuario_id = UUID_TO_BIN(?)`,
      [uuid]
    );

    return userResult[0];
  }

  static async findByEmail({ email }) {
    const [users] = await connection.query(
      "SELECT BIN_TO_UUID(usuario_id) as usuario_id, username, email, contraseña FROM usuarios WHERE email = ?",
      [email]
    );

    return users.length > 0 ? users[0] : null;
  }

  static async findById(userId) {
    const [users] = await connection.query(
      "SELECT BIN_TO_UUID(usuario_id) as usuario_id, username, email FROM usuarios WHERE usuario_id = UUID_TO_BIN(?)",
      [userId]
    );
    return users.length > 0 ? users[0] : null;
  }
}
