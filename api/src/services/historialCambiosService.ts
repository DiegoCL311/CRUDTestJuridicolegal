import HistorialCambiosModel, { IDataHistorialCambio, IHistorialCambio, } from '../models/historialcambios';
import { NoEntryError } from '../core/ApiError';
import UsuarioModel from '../models/usuario';

/**
 * Obtener todos los cambios de una reserva.
 * @param {number} nFolio – ID de la reserva.
 * @returns {IHistorialCambio | null} – HistorialCambio o null.
 */
export const obtenerCambios = async (nFolio: number): Promise<IHistorialCambio[] | null> => {
    const Cambios = await HistorialCambiosModel.findAll({
        where: { nFolio, bActivo: true },
        order: [['dFecha', 'DESC']],
        include: [{
            model: UsuarioModel,
            as: 'usuario',
            attributes: ['cNombres']
        }]
    });

    return Cambios;
};

/**
 * Registrar un nuevo cambio.
 * @param {IDataHistorialCambio} cambio – Campos del HistorialCambio a crear.
 * @returns {IHistorialCambio} – HistorialCambio o null.
 */
export const registrarCambio = async (cambio: IDataHistorialCambio): Promise<IHistorialCambio> => {
    const Cambios = await HistorialCambiosModel.create(cambio);
    return Cambios;
};
