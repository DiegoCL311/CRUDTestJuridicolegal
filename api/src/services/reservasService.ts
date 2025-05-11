import ReservaModel, { IReserva, IDataReserva } from '../models/reservas';
import { NoEntryError } from '../core/ApiError';

/**
 * Obtiene reservas de un espacio por su ID.
 * @param {number} nEspacio – ID del espacio a buscar.
 * @returns {IReserva | null} – Rol completo (incluye  timestamps).
 */
export const obtenerReservasAprovadasByEspacio = async (nEspacio: number): Promise<{ dFechaInicio: string, dFechaFin: string }[] | null> => {
    const reservas = await ReservaModel.findAll({
        where: { nEspacio, nEstatus: 3, bActivo: true },
    });

    return reservas.flatMap((reserva) => { return { dFechaInicio: reserva.dFechaInicio, dFechaFin: reserva.dFechaFin } });
};

/**
 * Crea un nuevo Rol.
 * @param {IDataReserva} reserva – Campos del Reserva a crear.
 * @returns {IReserva} Objeto Reserva creado.
 */
export const crearReserva = async (reserva: IDataReserva): Promise<IDataReserva> => {
    const RolInsertado = await ReservaModel.create(reserva);
    return RolInsertado.toObj();
};

/**
 * Actualiza campos de un Rol existente.
 * @param {IRolUpdate} Rol – nRol y campos opcionales a modificar.
 * @returns {IRol} – Rol público actualizado.
 * @throws {NoEntryError} – Si no se encuentra el Rol.
 */
export const actualizarReserva = async (nFolio: number, Rol: Partial<IDataReserva>): Promise<IDataReserva> => {
    const instancia = await ReservaModel.findByPk(nFolio);
    if (!instancia) throw new NoEntryError('Reserva no encontrada');
    await instancia.update(Rol);
    return instancia.toObj();
};

