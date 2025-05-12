import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IUsuario } from "../models/usuario";
import { AuthFailureError, BadRequestError } from "../core/ApiError";
import { getAccessToken, validateTokenData } from '../utils/authUtils'
import JWT from '../core/jwt';
import Usuario from "../models/usuario";
import RolModel from "../models/roles";

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {

  // obtiene y valida el token de autenticación
  const accessToken = getAccessToken(req.headers.authorization);

  try {
    // Verificar y decodificar el token
    const decodedToken = await JWT.decode(accessToken);

    // Validar los datos del token
    validateTokenData(decodedToken);

    // Asignar los datos del usuario al objeto req
    const usuario = await Usuario.findByPk(decodedToken.sub, { attributes: { exclude: ['contrasena'] } }).then((usuario) => usuario?.toJSON());
    if (!usuario) throw new BadRequestError("Usuario no encontrado");

    req.usuario = usuario;

    const rol = await RolModel.findByPk(usuario.nRol).then((rol) => rol?.toJSON());
    if (!rol) throw new BadRequestError("Rol no encontrado");

    req.rol = rol;

    next();
  } catch (error) {
    next(new AuthFailureError("Token de autenticación inválido."));
  }
};

export default authMiddleware;
