import request from 'supertest';
import app from '../../../src/app';
import loaders from '../../../src/loaders';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
dotenv.config({ path: '.env.test' });

describe('Auth Controller', () => {
    let cUsuario: string;
    let cPassword: string;
    let cNombres: string;
    let cApellidos: string;
    const nRol = 1;

    beforeAll(async () => { await loaders.init({ expressApp: app }); });
    afterAll(() => { /* cerrar conexión si es necesario */ });

    it('debe devolver 400 al iniciar sesión con cuerpo vacío', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({});
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'cUsuario: Required, cPassword: Required');
    });

    it('debe registrar exitosamente con datos válidos', async () => {
        cUsuario = faker.internet.userName();
        cPassword = faker.internet.password(8);
        cNombres = faker.name.firstName();
        cApellidos = faker.name.lastName();

        const response = await request(app)
            .post('/api/auth/register')
            .send({ cNombres, cApellidos, cUsuario, cPassword, nRol });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Registro exitoso');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('cUsuario', cUsuario);
        expect(response.body.data).toHaveProperty('cNombres', cNombres);
        expect(response.body.data).toHaveProperty('cApellidos', cApellidos);
        expect(response.body.data).toHaveProperty('nRol', nRol);
    });

    it('debe devolver token válido al iniciar sesión con credenciales correctas', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({ cUsuario, cPassword });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Inicio de sesion exitoso');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('accessToken');
        expect(response.body.data.usuario).toHaveProperty('cUsuario', cUsuario);
    });

    it('debe devolver 401 al iniciar sesión con credenciales inválidas', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({ cUsuario: 'noExiste', cPassword: '123456' });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', 'Credenciales inválidas');
    });

    it('debe devolver 400 al registrar con nombre muy corto', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({ cNombres: 'Al', cApellidos: 'Lo', cUsuario: 'user123', cPassword: 'pw1234', nRol });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message');
    });

    it('debe devolver 400 al registrar con contraseña muy corta', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({ cNombres: 'Usuario', cApellidos: 'Prueba', cUsuario: 'user123', cPassword: '123', nRol });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message');
    });
});
