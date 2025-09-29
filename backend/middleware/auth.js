import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

export const authUser = (req, res, next) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return res.status(401).json("Usuario no autorizado");
  }

  try {
    const data = jwt.verify(accessToken, process.env.JWT_SECRET);

    if (data) {
      req.user = data;
      next();
    }
  } catch (error) {
    return res.status(403).json({ error: "Token inválido" });
  }
};
