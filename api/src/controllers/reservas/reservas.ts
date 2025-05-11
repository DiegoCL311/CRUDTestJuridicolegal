import { Request, Response } from 'express';
import { SuccessResponse, NoContentResponse } from '../../core/ApiResponse';
import * as reservasService from "../../services/reservasService";


const obtenerReservasAprovadasByEspacio = async (req: Request, res: Response) => {
    const reservas = await reservasService.obtenerReservasAprovadasByEspacio(Number(req.params?.nEspacio));
    new SuccessResponse("Éxito", reservas).send(res)
}

const registrarReserva = async (req: Request, res: Response) => {
    const usuario = req.usuario;
    const reserva = await reservasService.crearReserva({ ...req.body, nUsuario: usuario?.nUsuario });
    new SuccessResponse("Éxito", reserva).send(res)
}

export default {
    obtenerReservasAprovadasByEspacio,
    registrarReserva
}