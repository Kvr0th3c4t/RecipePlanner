import { validateUser } from "../schemas/userSchema.js";
import * as userService from "../services/userService.js";
import { successResponse, errorResponse } from "../utils/responseHelper.js";
import { MESSAGES } from "../constants/messages.js";

export class userController {
  /**
   * POST /api/register
   * Registra un nuevo usuario y genera tokens JWT
   */

  static async createUser(req, res) {
    const validation = validateUser(req.body);

    if (!validation.success) {
      return errorResponse(res, 400, MESSAGES.INVALID_DATA);
    }

    try {
      const result = await userService.registerUser(validation.data);

      res.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 1000,
      });

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return successResponse(res, 201, MESSAGES.USER_CREATED, {
        user: {
          usuario_id: result.user.usuario_id,
          username: result.user.username,
        },
      });
    } catch (error) {
      console.log("=== ERROR EN CONTROLLER ===");
      console.log("Error completo:", error);
      console.log("Error message:", error.message);
      console.log("Error statusCode:", error.statusCode);

      if (error.statusCode === 409) {
        return errorResponse(
          res,
          409,
          MESSAGES.USER_ALREADY_EXISTS || "El usuario ya existe"
        );
      }

      return errorResponse(
        res,
        500,
        error.message || MESSAGES.USER_CREATION_ERROR
      );
    }
  }

  /**
   * POST /api/profile
   * Obtiene el perfil de un usuario si el usuario existe
   */

  static async getUserProfile(req, res) {
    try {
      const profile = await userService.getUserProfile(req.user.usuario_id);

      return successResponse(res, 200, MESSAGES.PROFILE_RETRIEVED, {
        profile: {
          usuario_id: profile.user.usuario_id,
          username: profile.user.username,
        },
      });
    } catch (error) {
      if (error.statusCode === 404) {
        return errorResponse(res, 404, MESSAGES.USER_NOT_FOUND);
      }
      return errorResponse(res, 500, MESSAGES.INTERNAL_ERROR);
    }
  }
}
