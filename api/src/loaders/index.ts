import expressLoader from "./express";
import { loggerLoader } from "./logger";
import { sequelizeLoader } from "./sequelize";
import { Express } from "express";

const init = async ({ expressApp }: { expressApp: Express }) => {
  await expressLoader({ app: expressApp });
  await loggerLoader();
  await sequelizeLoader();
  //await mongooseLoader();
  //await postgresLoader();
  //await mysqlLoader();
  //await mssqlLoader();
};

export default { init };
