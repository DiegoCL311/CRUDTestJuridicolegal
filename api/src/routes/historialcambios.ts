import { Router } from "express";
import asyncErrorHandler from "../utils/asyncErrorHandler";
import espaciosController from "../controllers/historialcambios/hisotrialcambios";

const app = Router();

app.get('/:nFolio', asyncErrorHandler(espaciosController.obtenerCambios));


export default app;