import EspacioService, { IEspacio } from '../models/espacios';
import { NoEntryError } from '../core/ApiError';

/**
 * Obtener todos los espacios.
 * @returns {IEspacio | null} – Espacio o null.
 */
export const obtenerEspacios = async (): Promise<IEspacio[]> => {
    const Espacio = await EspacioService.findAll({ where: { bActivo: true } });
    return Espacio.map((espacio) => (espacio.toJSON() as IEspacio));
};

/**
 * Obtener todos los espacios.
 * @returns {IEspacio | null} – Espacio o null.
 */
export const obtenerEspaciosById = async (id: number): Promise<IEspacio | null> => {
    const Espacio = await EspacioService.findOne({ where: { nEspacio: id, bActivo: true } });

    return Espacio;
};
