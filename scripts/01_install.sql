/*
  Scripts de instalación de la base de datos para el sistema de reservación de eventos.
  Mysql.
*/

CREATE DATABASE IF NOT EXISTS reservaseventos;
USE reservaseventos;


-- reservaseventos.roles definition
CREATE TABLE `roles` (
  `nRol` tinyint unsigned NOT NULL AUTO_INCREMENT,
  `cRol` varchar(20) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`nRol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- reservaseventos.usuarios definition
CREATE TABLE `usuarios` (
  `nUsuario` int unsigned NOT NULL AUTO_INCREMENT,
  `cUsuario` varchar(100) NOT NULL,
  `nRol` tinyint unsigned NOT NULL,
  `cNombres` varchar(50) NOT NULL,
  `cApellidos` varchar(50) NOT NULL,
  `cPassword` varchar(255) NOT NULL,
  `bActivo` tinyint NOT NULL DEFAULT '1',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`nUsuario`),
  UNIQUE KEY `cUsuario` (`cUsuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- reservaseventos.sesiones definition
CREATE TABLE `sesiones` (
  `nSesion` int unsigned NOT NULL AUTO_INCREMENT,
  `nUsuario` int unsigned NOT NULL,
  `accessKey` varchar(768) NOT NULL,
  `refreshKey` varchar(768) NOT NULL,
  `bActivo` tinyint NOT NULL DEFAULT '1',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`nSesion`),
  UNIQUE KEY `accessKey` (`accessKey`),
  UNIQUE KEY `refreshKey` (`refreshKey`),
  KEY `nUsuario` (`nUsuario`),
  CONSTRAINT `sesiones_ibfk_1` FOREIGN KEY (`nUsuario`) REFERENCES `usuarios` (`nUsuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- reservaseventos.espacios definition
CREATE TABLE `espacios` (
  `nEspacio` int unsigned NOT NULL AUTO_INCREMENT,
  `cEspacio` varchar(64) NOT NULL,
  `cCapacidad` varchar(64) NOT NULL,
  `cDescripcion` varchar(128) NOT NULL,
  `cIcono` varchar(64) NOT NULL,
  `cColor` varchar(64) NOT NULL,
  `bActivo` tinyint NOT NULL DEFAULT '1',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`nEspacio`),
  UNIQUE KEY `cEspacio` (`cEspacio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- reservaseventos.estatus definition
CREATE TABLE `estatus` (
  `nEstatus` tinyint  NOT NULL,
  `cEstatus` varchar(15) NOT NULL,
  `cColor` varchar(15) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`nEstatus`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- reservaseventos.reservas definition
CREATE TABLE `reservas` (
  `nFolio` int unsigned NOT NULL AUTO_INCREMENT,
  `nEspacio` int unsigned NOT NULL,
  `dFechaInicio` DATETIME NOT NULL,
  `dFechaFin` DATETIME NOT NULL,
  `nUsuario`int unsigned NOT NULL,
  `cNombreSolicitante` varchar(100) NOT NULL,
  `cDepartamento` varchar(64) NOT NULL,
  `cDuracionEstimada` varchar(64) NOT NULL,
  `cDescripcion` varchar(128) NOT NULL,
  `nEstatus` tinyint NOT NULL DEFAULT '1',
  `bActivo` tinyint NOT NULL DEFAULT '1',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`nFolio`),
  KEY `nEspacio` (`nEspacio`),
  CONSTRAINT `reservas_ibfk_1` FOREIGN KEY (`nEspacio`) REFERENCES `espacios` (`nEspacio`),
  CONSTRAINT `reservas_ibfk_2` FOREIGN KEY (`nUsuario`) REFERENCES `usuarios` (`nUsuario`),
  CONSTRAINT `reservas_ibfk_3` FOREIGN KEY (`nEstatus`) REFERENCES `estatus` (`nEstatus`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- reservaseventos.historialcambios definition
CREATE TABLE `historialcambios` (
  `nCambio` int unsigned NOT NULL AUTO_INCREMENT,
  `nFolio` int unsigned NOT NULL,
  `nUsuario` int unsigned NOT NULL,
  `dFecha` DATETIME NOT NULL,
  `cAccion` varchar(100) NOT NULL,
  `bActivo` tinyint NOT NULL DEFAULT '1',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`nCambio`),
  CONSTRAINT `historialcambios_ibfk_1` FOREIGN KEY (`nFolio`) REFERENCES `reservas` (`nFolio`),
  CONSTRAINT `historialcambios_ibfk_2` FOREIGN KEY (`nUsuario`) REFERENCES `usuarios` (`nUsuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE DATABASE IF NOT EXISTS test;
USE test;


-- test.roles definition
CREATE TABLE `roles` (
  `nRol` tinyint unsigned NOT NULL AUTO_INCREMENT,
  `cRol` varchar(20) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`nRol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- test.usuarios definition
CREATE TABLE `usuarios` (
  `nUsuario` int unsigned NOT NULL AUTO_INCREMENT,
  `cUsuario` varchar(100) NOT NULL,
  `nRol` tinyint unsigned NOT NULL,
  `cNombres` varchar(50) NOT NULL,
  `cApellidos` varchar(50) NOT NULL,
  `cPassword` varchar(255) NOT NULL,
  `bActivo` tinyint NOT NULL DEFAULT '1',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`nUsuario`),
  UNIQUE KEY `cUsuario` (`cUsuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- test.sesiones definition
CREATE TABLE `sesiones` (
  `nSesion` int unsigned NOT NULL AUTO_INCREMENT,
  `nUsuario` int unsigned NOT NULL,
  `accessKey` varchar(768) NOT NULL,
  `refreshKey` varchar(768) NOT NULL,
  `bActivo` tinyint NOT NULL DEFAULT '1',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`nSesion`),
  UNIQUE KEY `accessKey` (`accessKey`),
  UNIQUE KEY `refreshKey` (`refreshKey`),
  KEY `nUsuario` (`nUsuario`),
  CONSTRAINT `sesiones_ibfk_1` FOREIGN KEY (`nUsuario`) REFERENCES `usuarios` (`nUsuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- test.espacios definition
CREATE TABLE `espacios` (
  `nEspacio` int unsigned NOT NULL AUTO_INCREMENT,
  `cEspacio` varchar(64) NOT NULL,
  `cCapacidad` varchar(64) NOT NULL,
  `cDescripcion` varchar(128) NOT NULL,
  `cIcono` varchar(64) NOT NULL,
  `cColor` varchar(64) NOT NULL,
  `bActivo` tinyint NOT NULL DEFAULT '1',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`nEspacio`),
  UNIQUE KEY `cEspacio` (`cEspacio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- test.estatus definition
CREATE TABLE `estatus` (
  `nEstatus` tinyint  NOT NULL,
  `cEstatus` varchar(15) NOT NULL,
  `cColor` varchar(15) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`nEstatus`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- test.reservas definition
CREATE TABLE `reservas` (
  `nFolio` int unsigned NOT NULL AUTO_INCREMENT,
  `nEspacio` int unsigned NOT NULL,
  `dFechaInicio` DATETIME NOT NULL,
  `dFechaFin` DATETIME NOT NULL,
  `nUsuario`int unsigned NOT NULL,
  `cNombreSolicitante` varchar(100) NOT NULL,
  `cDepartamento` varchar(64) NOT NULL,
  `cDuracionEstimada` varchar(64) NOT NULL,
  `cDescripcion` varchar(128) NOT NULL,
  `nEstatus` tinyint NOT NULL DEFAULT '1',
  `bActivo` tinyint NOT NULL DEFAULT '1',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`nFolio`),
  KEY `nEspacio` (`nEspacio`),
  CONSTRAINT `reservas_ibfk_1` FOREIGN KEY (`nEspacio`) REFERENCES `espacios` (`nEspacio`),
  CONSTRAINT `reservas_ibfk_2` FOREIGN KEY (`nUsuario`) REFERENCES `usuarios` (`nUsuario`),
  CONSTRAINT `reservas_ibfk_3` FOREIGN KEY (`nEstatus`) REFERENCES `estatus` (`nEstatus`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- test.historialcambios definition
CREATE TABLE `historialcambios` (
  `nCambio` int unsigned NOT NULL AUTO_INCREMENT,
  `nFolio` int unsigned NOT NULL,
  `nUsuario` int unsigned NOT NULL,
  `dFecha` DATETIME NOT NULL,
  `cAccion` varchar(100) NOT NULL,
  `bActivo` tinyint NOT NULL DEFAULT '1',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`nCambio`),
  CONSTRAINT `historialcambios_ibfk_1` FOREIGN KEY (`nFolio`) REFERENCES `reservas` (`nFolio`),
  CONSTRAINT `historialcambios_ibfk_2` FOREIGN KEY (`nUsuario`) REFERENCES `usuarios` (`nUsuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;