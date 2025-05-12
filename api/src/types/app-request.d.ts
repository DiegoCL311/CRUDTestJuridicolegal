import { Request } from "express";
import { IUsuario } from "../models/usuario";
import { IRol } from "../models/roles";

declare global {
  namespace Express {
    export interface Request {
      usuario?: IUsuario;
      rol?: IRol
    }
  }
}
