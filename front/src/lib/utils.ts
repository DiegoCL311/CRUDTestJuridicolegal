import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const roles = {
  adminUser: "Administrador",
  employeeUser: "Empleado",
};

export type Usuario = {
  id: number;
  idRole: number;
  userName: string;
  email: string;
  roleName: string;
};

export const texts = {
  SHORT: "Muy corto!",
  LARGE: "Muy largo!",
  REQUIRED: "Requerido!",
  INVALID: "Invalido!",
  INV_EMAIL: "Email invalido!",
  INV_PHONE: "Telefono invalido!",
  INV_DATE: "Fecha invalida!",
  INV_NUMBER: "Numero invalido!",
  ONLYTEXT: "Solo texto!",
  ONLYNUMBER: "Solo numeros!",
  POSITIVE: "Solo numeros positivos!",
  NEGATIVE: "Solo numeros negativos!",
  INTEGER: "Solo numeros enteros!",
  VALIDATE: "Verifique los campos!",
};

export const regexs = {
  text: /^[a-zA-Z]+$/,
  email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
  phone: /^[0-9]{10}$/,
  date: /^\d{4}-\d{2}-\d{2}$/,
  number: /^[0-9]+$/,
};

// Resultado de la solicitud HTTP
export interface HttpResult<T> {
  data: T | null;
  error: string | null;
}

// Interfaz para los elementos del menú
type MenuItem = { title: string; url: string; items?: MenuItem[]; isActive?: boolean };

// Función recursiva para buscar la ruta en el menú y devolver el camino de migas
export function findBreadcrumbs(items: MenuItem[], pathname: string, trail: MenuItem[] = []): MenuItem[] | null { for (const item of items) { if (item.url === pathname) { return [...trail, item]; } if (item.items) { const result = findBreadcrumbs(item.items, pathname, [...trail, item]); if (result) { return result; } } } return null; }
