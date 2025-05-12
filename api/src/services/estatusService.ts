import EstatusModel, { IEstatus } from '../models/estatus';
import { NoEntryError } from '../core/ApiError';

/**
 * Obtener todos los Estatus.
 * @returns {IEstatus | null} – Estatus o null.
 */
export const obtenerEstatus = async (): Promise<IEstatus[] | null> => {
    const Estatus = await EstatusModel.findAll();
    return Estatus;
};

/**
 * Obtener todos los Estatus.
 * @returns {IEstatus | null} – Estatus o null.
 */
export const obtenerEstatusById = async (nEstatus: number): Promise<IEstatus | null> => {
    const Estatus = await EstatusModel.findOne({ where: { nEstatus } });

    return Estatus;
};
