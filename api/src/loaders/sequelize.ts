import { Sequelize } from "sequelize";
import { db } from "../config/index";
import User, { loadModel as loadUsuarioModel } from "../models/usuario";
import Rol, { loadModel as loadRolModel } from "../models/roles";
import Sesion, { loadModel as loadSesionModel } from "../models/sesion";
import Espacios, { loadModel as loadEspaciosModel } from "../models/espacios";
import Estatus, { loadModel as loadEstatusModel } from "../models/estatus";
import Reservas, { loadModel as loadReservasModel } from "../models/reservas";

let sequelize: Sequelize;

const sequelizeLoader = async () => {
  sequelize = new Sequelize(
    db.database.mysql.database,
    db.database.mysql.user,
    db.database.mysql.password,
    {
      host: db.database.mysql.host,
      port: Number(db.database.mysql.port),
      dialect: "mysql",
    }
  );

  await sequelize.authenticate();


  console.log(`Sequelize connected to ${db.database.mysql.database}.`);

  // Es necesario cargar los modelos para que Sequelize los reconozca
  loadUsuarioModel(sequelize);
  loadRolModel(sequelize);
  loadSesionModel(sequelize);
  loadEspaciosModel(sequelize);
  loadEstatusModel(sequelize);
  loadReservasModel(sequelize);


  return sequelize;
};

export { sequelizeLoader, sequelize };
