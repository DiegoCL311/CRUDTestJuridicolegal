USE reservaseventos;

-- ESTATUS -- TRUNCATE TABLE estatus -- SELECT * FROM estatus
INSERT INTO estatus (nEstatus, cEstatus, cColor) VALUES (1,"Solicitado", "#f7c740");
INSERT INTO estatus (nEstatus, cEstatus, cColor) VALUES (2,"Aprovado", "#479e36");
INSERT INTO estatus (nEstatus, cEstatus, cColor) VALUES (3,"Rechazado", "#c23636");

-- ROLE -- TRUNCATE TABLE roles -- SELECT * FROM roles
INSERT INTO roles (nRol, cRol) VALUES (1,"Administrador");
INSERT INTO roles (nRol, cRol) VALUES (2,"Empleado");

-- ESPACIOS -- TRUNCATE TABLE espacios -- SELECT * FROM espacios
INSERT INTO espacios (nEspacio, cEspacio, cCapacidad, cDescripcion, cIcono, cColor) VALUES (1,"Sala de reuniones pequeña", "15", "Pequeña sala ideal para equipos pequeños a medianos.", "notebook-pen", "#f7c740");
INSERT INTO espacios (nEspacio, cEspacio, cCapacidad, cDescripcion, cIcono, cColor) VALUES (2,"Sala de reuniones grande", "30", "Sala de reuniones principal, ideal para equipos medianos a grandes.", "projector", "#479e36");
INSERT INTO espacios (nEspacio, cEspacio, cCapacidad, cDescripcion, cIcono, cColor) VALUES (3,"Auditorio", "100", "Ideado para grandes conferencias.", "theater", "#c23636");
INSERT INTO espacios (nEspacio, cEspacio, cCapacidad, cDescripcion, cIcono, cColor) VALUES (4,"Área de descanso", "6", "Zona de chill para relajarse con amigos.", "hamburger", "#f7c740");

-- Usuario administrador -- TRUNCATE TABLE usuarios -- SELECT * FROM usuarios -- CONTRASEÑA: contraseña123
INSERT INTO usuarios (nRol, bActivo, cUsuario, cNombres, cApellidos, cPassword) VALUES(1, 1, 'Admin','Adm Pepito','Sanchez', '$2b$10$8AvJ7twGj4HUSUR6J0wxIuNSIeakmuZfZbERJbWz95pRb/TUxcoQK');
INSERT INTO usuarios (nRol, bActivo, cUsuario, cNombres, cApellidos, cPassword) VALUES(2, 1, 'Empleado','Emp Juan','Perez', '$2b$10$8AvJ7twGj4HUSUR6J0wxIuNSIeakmuZfZbERJbWz95pRb/TUxcoQK');