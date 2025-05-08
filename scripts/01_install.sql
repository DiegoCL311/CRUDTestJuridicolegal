/*
  Scripts de instalación de la base de datos para el sistema de reservación de eventos.
  Mysql.
*/

CREATE DATABASE IF NOT EXISTS reservaseventos;
USE reservaseventos;


-- reservaseventos.estatus definition
CREATE TABLE `estatus` (
  `nEstatus` tinyint  NOT NULL,
  `cEstatus` varchar(15) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`nEstatus`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


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
  `nRol` tinyint unsigned NOT NULL,
  `nEstatus` tinyint NOT NULL DEFAULT '1',
  `cNombres` varchar(50) NOT NULL,
  `cApellidos` varchar(50) NOT NULL,
  `cUsuario` varchar(100) NOT NULL,
  `cPassword` varchar(255) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`nUsuario`),
  UNIQUE KEY `cUsuario` (`cUsuario`),
  KEY `nEstatus` (`nEstatus`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`nEstatus`) REFERENCES `estatus` (`nEstatus`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- reservaseventos.sesiones definition
CREATE TABLE `sesiones` (
  `nSesion` int unsigned NOT NULL AUTO_INCREMENT,
  `nUsuario` int unsigned NOT NULL,
  `accessKey` varchar(768) NOT NULL,
  `refreshKey` varchar(768) NOT NULL,
  `nEstatus` tinyint NOT NULL DEFAULT '1',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`nSesion`),
  UNIQUE KEY `accessKey` (`accessKey`),
  UNIQUE KEY `refreshKey` (`refreshKey`),
  KEY `nUsuario` (`nUsuario`),
  CONSTRAINT `sesiones_ibfk_1` FOREIGN KEY (`nUsuario`) REFERENCES `usuarios` (`nUsuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;