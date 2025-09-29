import { userModel } from "../models/UserModel.js";
import { validateUser } from "../schemas/userSchema.js";
import { successResponse, errorResponse } from "../utils/responseHelper.js";
import { MESSAGES } from "../constants/messages.js";
import jwt from "jsonwebtoken";

export class userController {
  static async createUser(req, res) {
    console.log("=== DEBUG REGISTER ===");
    console.log("Datos recibidos:", req.body);

    const result = validateUser(req.body);
    console.log("Resultado validación:", result);

    if (!result.success) {
      console.log("ERROR VALIDACIÓN:", result.error);
      return errorResponse(res, 400, MESSAGES.INVALID_DATA);
    }

    try {
      console.log("Intentando crear usuario con:", result.data);
      const newUser = await userModel.createUser({
        email: result.data.email,
        username: result.data.username,
        contraseña: result.data.contraseña,
      });
      console.log("Usuario creado exitosamente:", newUser);

      const accessToken = jwt.sign(
        { usuario_id: newUser.usuario_id, username: newUser.username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      const refreshToken = jwt.sign(
        { usuario_id: newUser.usuario_id, username: newUser.username },
        process.env.JWT_REFRESH,
        { expiresIn: "7d" }
      );

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 1000,
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return successResponse(res, 201, MESSAGES.USER_CREATED, {
        user: {
          usuario_id: newUser.usuario_id,
          username: newUser.username,
        },
      });
    } catch (error) {
      console.log("ERROR EN CREATEUSER:", error);
      console.log("Stack trace:", error.stack);

      if (error.message === "El usuario ya existe") {
        return errorResponse(
          res,
          500,
          MESSAGES.USER_ALREADY_EXISTS || "El usuario ya existe"
        );
      }

      return errorResponse(res, 500, MESSAGES.USER_CREATION_ERROR);
    }
  }

  static async getUserProfile(req, res) {
    try {
      return successResponse(res, 200, MESSAGES.PROFILE_RETRIEVED, {
        profile: {
          usuario_id: req.user.usuario_id,
          username: req.user.username,
        },
      });
    } catch (error) {
      return errorResponse(res, 500, MESSAGES.INTERNAL_ERROR);
    }
  }
}
