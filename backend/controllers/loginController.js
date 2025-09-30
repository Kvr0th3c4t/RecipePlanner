import { validateLogin } from "../schemas/userSchema.js";
import { successResponse, errorResponse } from "../utils/responseHelper.js";
import * as userService from "../services/userService.js";
import { MESSAGES } from "../constants/messages.js";
import jwt from "jsonwebtoken";

export class loginController {
  static async login(req, res) {
    const validation = validateLogin(req.body);

    if (!validation.success) {
      return errorResponse(res, 400, MESSAGES.INVALID_CREDENTIAL_FORMAT);
    }

    try {
      const result = await userService.userLogin(validation.data);

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

      return successResponse(res, 200, MESSAGES.LOGIN_SUCCESS, {
        usuario_id: result.user.usuario_id,
        username: result.user.username,
      });
    } catch (error) {
      if (error.statusCode === 401) {
        return errorResponse(res, 401, MESSAGES.INVALID_CREDENTIALS);
      }
      return errorResponse(res, 500, MESSAGES.LOGIN_ERROR);
    }
  }

  static async refresh(req, res) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return errorResponse(res, 401, MESSAGES.UNAUTHORIZED);
    }

    try {
      const verifiedToken = jwt.verify(refreshToken, process.env.JWT_REFRESH);

      const newAccessToken = jwt.sign(
        {
          usuario_id: verifiedToken.usuario_id,
          username: verifiedToken.username,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 1000,
      });

      return successResponse(res, 200, MESSAGES.TOKEN_RENEWED);
    } catch (error) {
      return errorResponse(res, 401, MESSAGES.SESSION_EXPIRED);
    }
  }

  static async logout(req, res) {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return successResponse(res, 200, MESSAGES.LOGOUT_SUCCESS);
  }
}
