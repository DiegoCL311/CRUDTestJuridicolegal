import { Request, Response } from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import { AuthFailureError } from '../../core/ApiError';
import * as reservasService from "../../services/reservasService";


const obtenerReservasAprovadasByEspacio = async (req: Request, res: Response) => {
    const reservas = await reservasService.obtenerReservasAprovadasByEspacio(Number(req.params?.nEspacio));
    new SuccessResponse("Éxito", reservas).send(res)
}

const obtenerReservas = async (req: Request, res: Response) => {
    // Solo administradores (podria ser un middleware)
    const nRol = req.rol?.nRol;
    if (nRol != 1) throw new AuthFailureError("No tienes permisos para acceder a este recurso");

    const reservas = await reservasService.obtenerReservas();
    new SuccessResponse("Éxito", reservas).send(res)
}

const obtenerReservaByFolio = async (req: Request, res: Response) => {
    const nFolio = Number(req.params?.nFolio);

    const reservas = await reservasService.obtenerReservaByFolio(nFolio);
    new SuccessResponse("Éxito", reservas).send(res)
}

const registrarReserva = async (req: Request, res: Response) => {
    const usuario = req.usuario;
    const reserva = await reservasService.crearReserva({ ...req.body, nUsuario: usuario?.nUsuario });
    new SuccessResponse("Éxito", reserva).send(res)
}

const actualizarReserva = async (req: Request, res: Response) => {
    const nFolio = Number(req.params?.nFolio);
    const data = req.body;

    const reserva = await reservasService.actualizarReserva(nFolio, data);
    new SuccessResponse("Éxito", reserva).send(res)
}

const misReservas = async (req: Request, res: Response) => {
    const nUsuario = req.usuario?.nUsuario;
    const reservas = await reservasService.obtenerReservasByUsuario(Number(nUsuario));

    new SuccessResponse("Éxito", reservas).send(res)
}

export default {
    obtenerReservasAprovadasByEspacio,
    registrarReserva,
    misReservas,
    obtenerReservas,
    obtenerReservaByFolio,
    actualizarReserva,
}