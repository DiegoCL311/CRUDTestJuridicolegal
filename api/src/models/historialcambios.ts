import { Model, Sequelize, DataTypes } from 'sequelize';
import { z } from 'zod';
import { Usuario } from './usuario';

// 1. INTERFAZ DE TYPESCRIPT
export interface IHistorialCambio {
    nCambio: number;
    nFolio: number;
    nUsuario: number;
    dFecha: Date;
    cAccion: string;
    bActivo: boolean;
}

export interface IDataHistorialCambio {
    nFolio: number;
    nUsuario: number;
    dFecha: Date;
    cAccion: string;
}

// 2. ESQUEMA ZOD PARA VALIDACIÓN
export const historialCambioSchema = z.object({
    nCambio: z.number().min(1),
    nFolio: z.number().min(1),
    nUsuario: z.number().min(1),
    dFecha: z.date(),
    cAccion: z.string().min(1).max(100),
    bActivo: z.boolean(),
});

// 3. MODELO SEQUELIZE CON MÉTODOS DE INSTANCIA
export class HistorialCambio extends Model<IHistorialCambio, IDataHistorialCambio> implements IHistorialCambio {
    declare public nCambio: number;
    declare public nFolio: number;
    declare public nUsuario: number;
    declare public dFecha: Date;
    declare public cAccion: string;
    declare public bActivo: boolean;
    declare public readonly createdAt: Date;
    declare public readonly updatedAt: Date;

    /** Regresa un objeto IHistorialCambio sin timestamps */
    public toObj(): IHistorialCambio { const { nCambio, nFolio, nUsuario, dFecha, cAccion, bActivo } = this.get({ plain: true }); return { nCambio, nFolio, nUsuario, dFecha, cAccion, bActivo }; }

    /** Regresa un objeto IHistorialCambio con todos los datos */
    public toObjFull(): IHistorialCambio { return this.get({ plain: true }) as IHistorialCambio; }
}

export const loadModel = (sequelize: Sequelize) => {
    HistorialCambio.init(
        {
            nCambio: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
            nFolio: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, references: { model: 'reservas', key: 'nFolio' } },
            nUsuario: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, references: { model: 'usuarios', key: 'nUsuario' } },
            dFecha: { type: DataTypes.DATE, allowNull: false },
            cAccion: { type: DataTypes.STRING(100), allowNull: false },
            bActivo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
        },
        {
            sequelize,
            modelName: 'HistorialCambio',
            tableName: 'historialcambios',
            timestamps: true,
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
        }
    );

    HistorialCambio.belongsTo(Usuario, { foreignKey: 'nUsuario', as: 'usuario' });
    Usuario.hasMany(HistorialCambio, { foreignKey: 'nUsuario', as: 'historialcambios' });

};

export default HistorialCambio;
