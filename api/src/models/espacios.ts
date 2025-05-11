import { Model, Sequelize, DataTypes } from 'sequelize';
import { z } from 'zod';

// 1. INTERFAZ DE TYPESCRIPT
export interface IEspacio {
    nEspacio: number;
    cEspacio: string;
    cCapacidad: string;
    cDescripcion: string;
    cIcono: string;
    cColor: string;
    bActivo: boolean;
}

// 2. ESQUEMA ZOD PARA VALIDACIÓN
export const espacioSchema = z.object({
    nEspacio: z.number().min(1),
    cEspacio: z.string().min(3).max(64),
    cCapacidad: z.string().min(1).max(64),
    cDescripcion: z.string().min(1).max(128),
    cIcono: z.string().min(1).max(64),
    cColor: z.string().min(1).max(64),
    bActivo: z.boolean(),
});

// 3. MODELO SEQUELIZE CON MÉTODOS DE INSTANCIA
export class Espacio extends Model<IEspacio> implements IEspacio {
    declare public nEspacio: number;
    declare public cEspacio: string;
    declare public cCapacidad: string;
    declare public cDescripcion: string;
    declare public cIcono: string;
    declare public cColor: string;
    declare public bActivo: boolean;
    declare public readonly createdAt: Date;
    declare public readonly updatedAt: Date;

    /**
     * Regresa un objeto IEspacio sin timestamps
     */
    public toObj(): IEspacio {
        const { nEspacio, cEspacio, cCapacidad, cDescripcion, cIcono, cColor, bActivo } = this.get({ plain: true });
        return { nEspacio, cEspacio, cCapacidad, cDescripcion, cIcono, cColor, bActivo };
    }

    /**
     * Regresa un objeto IEspacio con todos los datos
     */
    public toObjFull(): IEspacio {
        return this.get({ plain: true }) as IEspacio;
    }
}

export const loadModel = (sequelize: Sequelize) => {
    Espacio.init(
        {
            nEspacio: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
            cEspacio: { type: DataTypes.STRING(64), allowNull: false, unique: true },
            cCapacidad: { type: DataTypes.STRING(64), allowNull: false },
            cDescripcion: { type: DataTypes.STRING(128), allowNull: false },
            cIcono: { type: DataTypes.STRING(64), allowNull: false },
            cColor: { type: DataTypes.STRING(64), allowNull: false },
            bActivo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
        },
        {
            sequelize,
            modelName: 'Espacio',
            tableName: 'espacios',
            timestamps: true,
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
        }
    );
};

export default Espacio;
