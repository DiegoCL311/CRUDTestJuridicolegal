import ReservaModel, { IReserva, IDataReserva } from '../models/reservas';
import { NoEntryError } from '../core/ApiError';

/**
 * Obtiene reservas de un espacio por su ID.
 * @param {number} nEspacio – ID del espacio a buscar.
 * @returns {IReserva | null} – Reserva completo (incluye  timestamps).
 */
export const obtenerReservasAprovadasByEspacio = async (nEspacio: number): Promise<{ dFechaInicio: string, dFechaFin: string }[] | null> => {
    const reservas = await ReservaModel.findAll({
        where: { nEspacio, nEstatus: 2, bActivo: true },
    });

    return reservas.flatMap((reserva) => { return { dFechaInicio: reserva.dFechaInicio, dFechaFin: reserva.dFechaFin } });
};

/**
 * Obtiene reservas de un espacio por su ID.
 * @returns {IReserva | null} – Reserva completo (incluye  timestamps).
 */
export const obtenerReservas = async (): Promise<{ dFechaInicio: string, dFechaFin: string }[] | null> => {
    const reservas = await ReservaModel.findAll({
        where: { bActivo: true },
    });

    return reservas.flatMap((reserva) => { return { dFechaInicio: reserva.dFechaInicio, dFechaFin: reserva.dFechaFin } });
};

/**
 * Obtiene reservas de un espacio por su ID.
 * @param {number} nFolio – ID del espacio a buscar.
 * @returns {IReserva | null} – Reserva completo (incluye  timestamps).
 */
export const obtenerReservaByFolio = async (nFolio: number): Promise<IReserva | null> => {
    const reserva = await ReservaModel.findOne({
        where: { nFolio, bActivo: true },
        include: ['estatus'],
    });

    if (!reserva) throw new NoEntryError('Reserva no encontrada');

    return reserva;
};

/**
 * Crea una nueva reserva.
 * @param {IDataReserva} reserva – Campos del Reserva a crear.
 * @returns {IReserva} Objeto Reserva creado.
 */
export const crearReserva = async (reserva: IDataReserva): Promise<IDataReserva> => {
    const ReservaInserted = await ReservaModel.create(reserva);
    return ReservaInserted.toObj();
};

/**
 * Obtiene reservas de un usuario.
 * @param {number} nUsuario – ID del usuario a buscar.
 * @returns {IReserva} Objeto Reserva creado.
 */
export const obtenerReservasByUsuario = async (nUsuario: number): Promise<IReserva[]> => {
    const reservas = await ReservaModel.findAll({
        where: { nUsuario, bActivo: true },
        order: [['createdAt', 'DESC']],
        include: ['espacio', 'estatus'],
    });

    return reservas;
};

/**
 * Actualiza campos de un Reserva existente.
 * @param {IReservaUpdate} Reserva – nReserva y campos opcionales a modificar.
 * @returns {IReserva} – Reserva público actualizado.
 * @throws {NoEntryError} – Si no se encuentra el Reserva.
 */
export const actualizarReserva = async (nFolio: number, reserva: Partial<IDataReserva>): Promise<IDataReserva> => {
    const instancia = await ReservaModel.findByPk(nFolio);
    if (!instancia) throw new NoEntryError('Reserva no encontrada');
    await instancia.update(reserva);
    return instancia.toObj();
};

