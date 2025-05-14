import { Router } from "express";
import asyncErrorHandler from "../utils/asyncErrorHandler";
import espaciosController from "../controllers/espacios/espacios";

const app = Router();

app.get('/', asyncErrorHandler(espaciosController.obtenerEspacios));

app.get('/espaciosConRangosOcupadosHoy', asyncErrorHandler(espaciosController.espaciosRangosOcupadosHoy));

export default app;