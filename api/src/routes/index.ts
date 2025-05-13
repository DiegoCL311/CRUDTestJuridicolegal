import express from "express";
import testRoutes from "./test"
import authRoutes from "./auth";
import asyncErrorHandler from '../utils/asyncErrorHandler';
import authMiddleware from "../middlewares/authMiddleware";
import espaciosRoutes from "./espacios";
import reservasRoutes from "./reservas";
import historialcambiosRoutes from "./historialcambios";


const app = express();

// Rutas no protegidas por middleware de autenticación
app.use("/auth", authRoutes);

app.use("/espacios", asyncErrorHandler(authMiddleware), espaciosRoutes);

app.use("/reservas", asyncErrorHandler(authMiddleware), reservasRoutes);

app.use("/historialcambios", asyncErrorHandler(authMiddleware), historialcambiosRoutes);

// Rutas protegidas por middleware de autenticación
app.get("/test", asyncErrorHandler(authMiddleware), testRoutes);

export default app;
