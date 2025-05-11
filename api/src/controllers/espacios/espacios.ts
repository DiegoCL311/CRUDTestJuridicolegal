import { Request, Response } from 'express';
import { SuccessResponse, NoContentResponse } from '../../core/ApiResponse';
import * as espaciosService from "../../services/espacioService";


const obtenerEspacios = async (req: Request, res: Response) => {

    const espacios = await espaciosService.obtenerEspacios();

    new SuccessResponse("Éxito", espacios).send(res)

}

export default {
    obtenerEspacios,
}