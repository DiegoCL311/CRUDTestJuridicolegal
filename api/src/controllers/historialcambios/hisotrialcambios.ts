import { Request, Response } from 'express';
import { SuccessResponse, NoContentResponse } from '../../core/ApiResponse';
import * as historialCambiosService from "../../services/historialCambiosService";


const obtenerCambios = async (req: Request, res: Response) => {
    const nFolio = Number(req.params?.nFolio);

    const cambios = await historialCambiosService.obtenerCambios(nFolio);

    new SuccessResponse("Éxito", cambios).send(res)

}

export default {
    obtenerCambios,
}