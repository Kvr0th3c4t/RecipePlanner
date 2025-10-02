import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userModel } from "../models/userModel.js";

/**
 * Función que registra un usuario en el sistema
 * @param {Object} userData - Datos del usuario (username, email, contraseña)
 * @returns {Promise<Object>} Crea un usuario y le asigna tokens JWT
 */

export const registerUser = async (userData) => {
  const { username, email, contraseña } = userData;

  const existingUser = await userModel.findByEmail({ email });

  if (existingUser) {
    const error = new Error("El email ya está registrado");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(contraseña, 10);

  const newUser = await userModel.createUser({
    username,
    email,
    contraseña: hashedPassword,
  });

  const tokens = generateTokens(newUser);

  const resultado = {
    user: {
      usuario_id: newUser.usuario_id,
      username: newUser.username,
      email,
    },
    ...tokens,
  };

  return resultado;
};

/**
 * Función que verifica credenciales y logea al usuario
 * @param {Object} credentials - Creenciales (email, contraseña)
 * @returns {Promise<Object>} Usuario autenticado con tokens JWT
 */

export const userLogin = async (credentials) => {
  const { email, contraseña } = credentials;

  const existingUser = await userModel.findByEmail({ email });

  if (!existingUser) {
    const error = new Error("Credenciales incorrectas");
    error.statusCode = 401;
    throw error;
  }

  const existingPassword = await bcrypt.compare(
    contraseña,
    existingUser.contraseña
  );

  if (!existingPassword) {
    const error = new Error("Credenciales incorrectas");
    error.statusCode = 401;
    throw error;
  }

  const tokens = generateTokens(existingUser);

  return {
    user: {
      usuario_id: existingUser.usuario_id,
      username: existingUser.username,
      email,
    },
    ...tokens,
  };
};

/**
 * Obtiene el perfil de un usuario por su ID
 * @param {string} userId - ID del usuario (UUID formato string)
 * @returns {Promise<Object>} Datos del perfil del usuario
 */

export const getUserProfile = async (userId) => {
  const existingUser = await userModel.findById(userId);

  if (!existingUser) {
    const error = new Error("El usuario no existe");
    error.statusCode = 404;
    throw error;
  }

  return {
    user: {
      usuario_id: existingUser.usuario_id,
      username: existingUser.username,
      email: existingUser.email,
    },
  };
};

/**
 * Funcion para generar tokens de usuario
 * @param {Object} user - Objeto usuario con usuario_id
 * @returns {Object} Tokens de acceso y refresco
 */

const generateTokens = (user) => {
  const payload = {
    usuario_id: user.usuario_id,
    usuario_username: user.username,
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};
