import { Model, Sequelize, DataTypes } from 'sequelize';
import { z } from 'zod';

// 1. INTERFAZ DE TYPESCRIPT
export interface IReserva {
    nFolio: number;
    nEspacio: number;
    dFechaInicio: string;
    dFechaFin: string;
    nUsuario: number;
    cNombreSolicitante: string;
    cDepartamento: string;
    cDuracionEstimada: string;
    cDescripcion: string;
    nEstatus: number;
    bActivo: boolean;
}

export interface IDataReserva {
    nEspacio: number;
    dFechaInicio: string;
    dFechaFin: string;
    nUsuario: number;
    cNombreSolicitante: string;
    cDepartamento: string;
    cDuracionEstimada: string;
    cDescripcion: string;
    nEstatus: number;
}

// 2. ESQUEMA ZOD PARA VALIDACIÓN
export const reservaSchema = z.object({
    nEspacio: z.number().min(1),
    dFechaInicio: z.string(),
    dFechaFin: z.string(),
    cNombreSolicitante: z.string().min(1).max(100),
    cDepartamento: z.string().min(1).max(64),
    cDuracionEstimada: z.string().min(1).max(64),
    cDescripcion: z.string().min(1).max(128),
});

// 3. MODELO SEQUELIZE CON MÉTODOS DE INSTANCIA
export class Reserva extends Model<IReserva, IDataReserva> implements IReserva {
    declare public nFolio: number;
    declare public nEspacio: number;
    declare public dFechaInicio: string;
    declare public dFechaFin: string;
    declare public nUsuario: number;
    declare public cNombreSolicitante: string;
    declare public cDepartamento: string;
    declare public cDuracionEstimada: string;
    declare public cDescripcion: string;
    declare public nEstatus: number;
    declare public bActivo: boolean;
    declare public readonly createdAt: Date;
    declare public readonly updatedAt: Date;

    /**
     * Regresa un objeto IReserva sin timestamps
     */
    public toObj(): IReserva { const { nFolio, nEspacio, dFechaInicio, dFechaFin, nUsuario, cNombreSolicitante, cDepartamento, cDuracionEstimada, cDescripcion, nEstatus, bActivo } = this.get({ plain: true }); return { nFolio, nEspacio, dFechaInicio, dFechaFin, nUsuario, cNombreSolicitante, cDepartamento, cDuracionEstimada, cDescripcion, nEstatus, bActivo }; }

    /**
     * Regresa un objeto IReserva con todos los datos
     */
    public toObjFull(): IReserva { return this.get({ plain: true }) as IReserva; }
}

// 4. FUNCIÓN PARA CARGAR EL MODELO EN SEQUELIZE
export const loadModel = (sequelize: Sequelize) => {
    Reserva.init({
        nFolio: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
        nEspacio: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
        dFechaInicio: { type: DataTypes.DATE, allowNull: false },
        dFechaFin: { type: DataTypes.DATE, allowNull: false },
        nUsuario: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
        cNombreSolicitante: { type: DataTypes.STRING(100), allowNull: false },
        cDepartamento: { type: DataTypes.STRING(64), allowNull: false },
        cDuracionEstimada: { type: DataTypes.STRING(64), allowNull: false },
        cDescripcion: { type: DataTypes.STRING(128), allowNull: false },
        nEstatus: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 1 },
        bActivo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    }, {
        sequelize,
        modelName: 'Reserva',
        tableName: 'reservas',
        timestamps: true,
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
    });
};

export default Reserva;
