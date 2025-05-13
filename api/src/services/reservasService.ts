import ReservaModel, { IReserva, IDataReserva } from '../models/reservas';
import { NoEntryError, ForbiddenError } from '../core/ApiError';
import { Op } from 'sequelize';

/**
 * Obtiene reservas de un espacio por su ID.
 * @param {number} nEspacio – ID del espacio a buscar.
 * @returns {IReserva | null} – Reserva.
 */
export const obtenerReservasAprovadasByEspacio = async (nEspacio: number): Promise<{ dFechaInicio: string, dFechaFin: string }[] | null> => {
    const reservas = await ReservaModel.findAll({
        where: { nEspacio, nEstatus: 2, bActivo: true },
    });

    return reservas.map((reserva) => { return { dFechaInicio: reserva.dFechaInicio, dFechaFin: reserva.dFechaFin } });
};

/**
 * Obtiene reservas de un espacio por su ID.
 * @returns {IReserva | null} – Reserva.
 */
export const obtenerReservas = async (): Promise<IReserva[] | null> => {
    const reservas = await ReservaModel.findAll({
        where: { bActivo: true },
        include: ['espacio', 'estatus', 'usuario'],
        order: [['createdAt', 'DESC']],
    });

    return reservas;
};

/**
 * Obtiene una reserva por su ID.
 * @param {number} nFolio – ID de la reserva a buscar.
 * @returns {IReserva | null} – Reserva.
 */
export const obtenerReservaByFolio = async (nFolio: number): Promise<IReserva> => {
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
export const crearReserva = async (reserva: IDataReserva): Promise<IReserva> => {
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


/**
 * Elimina un Reserva existente.
 * @param {number} nFolio – ID del Reserva a eliminar.
 * @returns {IReserva} – Reserva eliminado.
 * @throws {NoEntryError} – Si no se encuentra el Reserva.
 */
export const eliminarReserva = async (nFolio: number): Promise<IDataReserva> => {
    const instancia = await ReservaModel.findByPk(nFolio);
    if (!instancia) throw new NoEntryError('Reserva no encontrada');
    await instancia.update({ bActivo: false });
    return instancia;
}

/**
 * Aprovar una reserva.
 * @param {number} nFolio – ID del Reserva a aprovar.
 * @returns {IReserva} – Reserva.
 * @throws {NoEntryError} – Si no se encuentra el Reserva.
 */
export const aprovarReserva = async (nFolio: number): Promise<IDataReserva> => {
    const reserva = await ReservaModel.findByPk(nFolio, { include: ['espacio', 'estatus', 'usuario'] });
    if (!reserva) throw new NoEntryError('Reserva no encontrada');

    const ocupado = await ReservaModel.findAll({
        where: {
            nEspacio: reserva.nEspacio,
            [Op.or]: [
                {
                    dFechaInicio: { [Op.lt]: new Date(reserva.dFechaFin) },
                    dFechaFin: { [Op.gt]: new Date(reserva.dFechaInicio) },
                }
            ],
            nEstatus: 2,
            bActivo: true,
        },
    });

    console.log('ocupado', ocupado);

    if (ocupado.length > 0) throw new ForbiddenError('El espacio ya fue reservado en ese periodo');

    await reserva.update({ nEstatus: 2 });
    return reserva;
}

/**
 * Aprovar una reserva.
 * @param {number} nFolio – ID del Reserva a aprovar.
 * @returns {IReserva} – Reserva.
 * @throws {NoEntryError} – Si no se encuentra el Reserva.
 */
export const rechazarReserva = async (nFolio: number): Promise<IDataReserva> => {
    const reserva = await ReservaModel.findByPk(nFolio, { include: ['espacio', 'estatus', 'usuario'] });
    if (!reserva) throw new NoEntryError('Reserva no encontrada');
    await reserva.update({ nEstatus: 3 });
    return reserva;
}

