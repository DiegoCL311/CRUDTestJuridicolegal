import EspacioService, { IEspacio } from '../models/espacios';
import { NoEntryError } from '../core/ApiError';

/**
 * Obtener todos los espacios.
 * @returns {IEspacio | null} – Espacio o null.
 */
export const obtenerEspacios = async (): Promise<IEspacio[] | null> => {
    const Espacio = await EspacioService.findAll({ where: { bActivo: true } });
    return Espacio;
};
