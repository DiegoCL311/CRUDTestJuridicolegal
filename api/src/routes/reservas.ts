import { Router } from "express";
import asyncErrorHandler from "../utils/asyncErrorHandler";
import reservasController from "../controllers/reservas/reservas";
import { validateRequest } from "../middlewares/validateRequest";
import { reservaSchema } from "../models/reservas"

const app = Router();

app.get('/obtenerReservasAprovadasByespacio/:nEspacio', asyncErrorHandler(reservasController.obtenerReservasAprovadasByEspacio));

app.post('/registrar', validateRequest(reservaSchema), asyncErrorHandler(reservasController.registrarReserva));

app.put('/actualizar/:nFolio', validateRequest(reservaSchema), asyncErrorHandler(reservasController.actualizarReserva));

app.get('/mis-reservas', asyncErrorHandler(reservasController.misReservas));

app.get('/', asyncErrorHandler(reservasController.obtenerReservas));

app.get('/obtener-reserva/:nFolio', asyncErrorHandler(reservasController.obtenerReservaByFolio));

app.delete('/eliminar/:nFolio', asyncErrorHandler(reservasController.eliminarReserva));

app.put('/aprovar/:nFolio', asyncErrorHandler(reservasController.aprovarReserva));

app.put('/rechazar/:nFolio', asyncErrorHandler(reservasController.rechazarReserva));

export default app;