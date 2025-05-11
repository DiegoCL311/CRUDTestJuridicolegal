import { Model, Sequelize, DataTypes } from 'sequelize';
import { z } from 'zod';

// 1. INTERFAZ DE TYPESCRIPT
export interface IEstatus {
    nEstatus: number;
    cEstatus: string;
    cColor: string;
}

// 2. ESQUEMA ZOD PARA VALIDACIÓN
export const estatusSchema = z.object({
    nEstatus: z.number().min(1),
    cEstatus: z.string().min(1).max(15),
    cColor: z.string().min(1).max(15),
});

// 3. MODELO SEQUELIZE CON MÉTODOS DE INSTANCIA
export class Estatus extends Model<IEstatus> implements IEstatus {
    declare public nEstatus: number;
    declare public cEstatus: string;
    declare public cColor: string;
    declare public readonly createdAt: Date;
    declare public readonly updatedAt: Date;

    /**
     * Regresa un objeto IEstatus sin timestamps
     */
    public toObj(): IEstatus {
        const { nEstatus, cEstatus, cColor } = this.get({ plain: true });
        return { nEstatus, cEstatus, cColor };
    }

    /**
     * Regresa un objeto IEstatus con todos los datos
     */
    public toObjFull(): IEstatus {
        return this.get({ plain: true }) as IEstatus;
    }
}

// 4. FUNCIÓN PARA CARGAR EL MODELO EN SEQUELIZE
export const loadModel = (sequelize: Sequelize) => {
    Estatus.init(
        {
            nEstatus: { type: DataTypes.TINYINT, allowNull: false, primaryKey: true },
            cEstatus: { type: DataTypes.STRING(15), allowNull: false },
            cColor: { type: DataTypes.STRING(15), allowNull: false },
        },
        {
            sequelize,
            modelName: 'Estatus',
            tableName: 'estatus',
            timestamps: true,
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
        }
    );
};

export default Estatus;
