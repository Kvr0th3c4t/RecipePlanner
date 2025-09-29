import express from "express";
import cors from "cors";
import recipeRoutes from "../backend/routes/recipeRoutes.js";
import userRoutes from "../backend/routes/userRoutes.js";
import planRoutes from "../backend/routes/planRoutes.js";
import ingredientRoutes from "../backend/routes/ingredientRoutes.js";
import unitRoutes from "../backend/routes/unitRoutes.js";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT ?? 3001;
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/", function (req, res) {
  res.send("<h1>Hola?<h1>");
});

app.use("/api", userRoutes);
app.use("/api", recipeRoutes);
app.use("/api", ingredientRoutes);
app.use("/api", planRoutes);
app.use("/api", unitRoutes);

app.listen(PORT, function () {
  console.log(`Servidor funcionando en puerto ${PORT}`);
});
