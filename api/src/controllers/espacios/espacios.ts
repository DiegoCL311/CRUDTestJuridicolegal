import { Request, Response } from 'express';
import { SuccessResponse, NoContentResponse } from '../../core/ApiResponse';
import * as espaciosService from "../../services/espacioService";
import * as reservasService from "../../services/reservasService";


const obtenerEspacios = async (req: Request, res: Response) => {

    const espacios = await espaciosService.obtenerEspacios();

    new SuccessResponse("Éxito", espacios).send(res)

}

const espaciosRangosOcupadosHoy = async (req: Request, res: Response) => {

    const espacios = await espaciosService.obtenerEspacios();
    const espaciosConRango = [];

    for (const espacio of espacios) {
        const rangosOcupados = await reservasService.obtenerReservasAprovadasByEspacioHoy(espacio.nEspacio);
        espaciosConRango.push({ ...espacio, rangosOcupados });
    }

    new SuccessResponse("Éxito", espaciosConRango).send(res)

}

export default {
    obtenerEspacios,
    espaciosRangosOcupadosHoy
}