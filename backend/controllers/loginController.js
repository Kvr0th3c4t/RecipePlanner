import { validateLogin } from "../schemas/userSchema.js";
import { userModel } from "../models/UserModel.js";
import { successResponse, errorResponse } from "../utils/responseHelper.js";
import { MESSAGES } from "../constants/messages.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export class loginController {
  static async login(req, res) {
    const result = validateLogin(req.body);

    if (!result.success) {
      return errorResponse(res, 400, MESSAGES.INVALID_CREDENTIAL_FORMAT);
    }

    try {
      const user = await userModel.findByEmail({ email: result.data.email });

      if (!user) {
        return errorResponse(res, 401, MESSAGES.INVALID_CREDENTIALS);
      }

      const passExist = await bcrypt.compare(
        result.data.contraseña,
        user.contraseña
      );

      if (!passExist) {
        return errorResponse(res, 401, MESSAGES.INVALID_CREDENTIALS);
      }

      const accessToken = jwt.sign(
        { usuario_id: user.usuario_id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      const refreshToken = jwt.sign(
        { usuario_id: user.usuario_id, username: user.username },
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

      return successResponse(res, 200, MESSAGES.LOGIN_SUCCESS, {
        usuario_id: user.usuario_id,
        username: user.username,
      });
    } catch (error) {
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
