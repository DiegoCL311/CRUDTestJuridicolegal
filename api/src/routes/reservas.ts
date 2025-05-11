import { Router } from "express";
import asyncErrorHandler from "../utils/asyncErrorHandler";
import reservasController from "../controllers/reservas/reservas";
import { validateRequest } from "../middlewares/validateRequest";
import { reservaSchema } from "../models/reservas"

const app = Router();

app.get('/obtenerReservasAprovadasByespacio/:nEspacio', asyncErrorHandler(reservasController.obtenerReservasAprovadasByEspacio));

app.post('/registrar', validateRequest(reservaSchema), asyncErrorHandler(reservasController.registrarReserva));

export default app;