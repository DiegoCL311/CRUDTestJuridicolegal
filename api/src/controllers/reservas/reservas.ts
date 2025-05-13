import { Request, Response } from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import { AuthFailureError } from '../../core/ApiError';
import * as reservasService from "../../services/reservasService";
import * as historialCambiosService from "../../services/historialCambiosService";



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
    const nUsuario = req.usuario?.nUsuario;
    if (!nUsuario) throw new AuthFailureError("No tienes permiso");

    console.log("registrarReserva", req.body);

    const reserva = await reservasService.crearReserva({ ...req.body, nUsuario: nUsuario });

    await historialCambiosService.registrarCambio({
        nFolio: reserva.nFolio,
        nUsuario: nUsuario,
        dFecha: new Date(),
        cAccion: 'REGISTRAR'
    });

    new SuccessResponse("Éxito", reserva).send(res)
}

const actualizarReserva = async (req: Request, res: Response) => {
    const nFolio = Number(req.params?.nFolio);
    const data = req.body;
    const nUsuario = req.usuario?.nUsuario;
    if (!nUsuario) throw new AuthFailureError("No tienes permiso");

    const reserva = await reservasService.actualizarReserva(nFolio, data);

    await historialCambiosService.registrarCambio({
        nFolio: nFolio,
        nUsuario: nUsuario,
        dFecha: new Date(),
        cAccion: 'ACTUALIZAR'
    });


    new SuccessResponse("Éxito", reserva).send(res)
}

const misReservas = async (req: Request, res: Response) => {
    const nUsuario = req.usuario?.nUsuario;
    const reservas = await reservasService.obtenerReservasByUsuario(Number(nUsuario));

    new SuccessResponse("Éxito", reservas).send(res)
}

const eliminarReserva = async (req: Request, res: Response) => {
    const nFolio = Number(req.params?.nFolio);
    const nUsuario = req.usuario?.nUsuario;
    if (!nUsuario) throw new AuthFailureError("No tienes permiso");

    const reservas = await reservasService.eliminarReserva(nFolio);

    await historialCambiosService.registrarCambio({
        nFolio: nFolio,
        nUsuario: nUsuario,
        dFecha: new Date(),
        cAccion: 'ELIMINAR'
    });

    new SuccessResponse("Éxito", reservas).send(res)
}

const aprovarReserva = async (req: Request, res: Response) => {
    const nFolio = Number(req.params?.nFolio);
    const nUsuario = req.usuario?.nUsuario;
    const nRol = req.rol?.nRol;
    if (nRol != 1 || !nUsuario) throw new AuthFailureError("No tienes permisos para acceder a este recurso");

    const reserva = await reservasService.aprovarReserva(nFolio);

    await historialCambiosService.registrarCambio({
        nFolio: nFolio,
        nUsuario: nUsuario,
        dFecha: new Date(),
        cAccion: 'APROVAR'
    });

    new SuccessResponse("Éxito", reserva).send(res)
}

const rechazarReserva = async (req: Request, res: Response) => {
    const nFolio = Number(req.params?.nFolio);
    const nUsuario = req.usuario?.nUsuario;
    // Solo administradores (podria ser un middleware)
    const nRol = req.rol?.nRol;
    if (nRol != 1 || !nUsuario) throw new AuthFailureError("No tienes permisos para acceder a este recurso");

    const reservas = await reservasService.rechazarReserva(nFolio);

    await historialCambiosService.registrarCambio({
        nFolio: nFolio,
        nUsuario: nUsuario,
        dFecha: new Date(),
        cAccion: 'RECHAZAR'
    });

    new SuccessResponse("Éxito", reservas).send(res)
}

export default {
    obtenerReservasAprovadasByEspacio,
    registrarReserva,
    misReservas,
    obtenerReservas,
    obtenerReservaByFolio,
    actualizarReserva,
    eliminarReserva,
    aprovarReserva,
    rechazarReserva
}