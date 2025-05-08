USE reservaseventos;

-- ESTATUS -- TRUNCATE TABLE estatus -- SELECT * FROM estatus
INSERT INTO estatus (nEstatus, cEstatus) VALUES (0,"Inactivo");
INSERT INTO estatus (nEstatus, cEstatus) VALUES (1,"Activo");

-- ROLE -- TRUNCATE TABLE roles -- SELECT * FROM roles
INSERT INTO roles (nRol, cRol) VALUES (1,"Administrador");
INSERT INTO roles (nRol, cRol) VALUES (2,"Publicador");

-- Usuario administrador -- TRUNCATE TABLE usuarios -- SELECT * FROM usuarios -- CONTRASEÑA: contraseña123
INSERT INTO usuarios (nUsuario, nRol, nEstatus, cUsuario, cNombres, cApellidos, cPassword) VALUES(1, 1, 1, 'Admin','Administrador','Apellidos', '$2b$10$8AvJ7twGj4HUSUR6J0wxIuNSIeakmuZfZbERJbWz95pRb/TUxcoQK');