import * as UsuarioService from '../../../src/services/usuarioService';
import { NoEntryError } from '../../../src/core/ApiError';
import Usuario from '../../../src/models/usuario';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';

describe('Servicio de Usuario', () => {
    const datosFull = {
        nUsuario: 1,
        cUsuario: 'JohnDoe',
        nRol: 2,
        bActivo: 1,
        cNombres: 'John',
        cApellidos: 'Doe',
        cPassword: 'securepassword',
        createdAt: new Date('2025-05-01T10:00:00Z'),
        updatedAt: new Date('2025-05-02T12:00:00Z'),
    };

    const datosPublicos = {
        nUsuario: 1,
        cUsuario: 'JohnDoe',
        nRol: 2,
        bActivo: 1,
        cNombres: 'John',
        cApellidos: 'Doe'
    };

    beforeEach(async () => jest.clearAllMocks());

    describe('obtenerUsuarioFullByUsuario', () => {
        it('debe devolver IUsuarioFull cuando existe', async () => {
            const instancia = { ...datosFull, toUsuarioFull: () => datosFull } as any;
            jest.spyOn(Usuario, 'findOne').mockResolvedValue(instancia);
            const resultado = await UsuarioService.obtenerUsuarioFullByUsuario('JohnDoe');
            expect(resultado).toEqual(datosFull);
        });
        it('debe devolver null cuando no existe', async () => {
            jest.spyOn(Usuario, 'findOne').mockResolvedValue(null);
            const resultado = await UsuarioService.obtenerUsuarioFullByUsuario('JohnDoe');
            expect(resultado).toBeNull();
        });
    });

    describe('obtenerUsuarioByPk', () => {
        it('debe devolver IUsuario cuando existe', async () => {
            const instancia = { ...datosFull, toUsuario: () => datosPublicos } as any;
            jest.spyOn(Usuario, 'findByPk').mockResolvedValue(instancia);
            const resultado = await UsuarioService.obtenerUsuarioByPk(1);
            expect(resultado).toEqual(datosPublicos);
        });
        it('debe devolver null cuando no existe', async () => {
            jest.spyOn(Usuario, 'findByPk').mockResolvedValue(null);
            const resultado = await UsuarioService.obtenerUsuarioByPk(1);
            expect(resultado).toBeNull();
        });
    });

    describe('obtenerUsuarioFullById', () => {
        it('debe devolver IUsuarioFull cuando existe', async () => {
            const instancia = { ...datosFull, toUsuarioFull: () => datosFull } as any;
            jest.spyOn(Usuario, 'findByPk').mockResolvedValue(instancia);
            const resultado = await UsuarioService.obtenerUsuarioFullById(1);
            expect(resultado).toEqual(datosFull);
        });
        it('debe devolver null cuando no existe', async () => {
            jest.spyOn(Usuario, 'findByPk').mockResolvedValue(null);
            const resultado = await UsuarioService.obtenerUsuarioFullById(1);
            expect(resultado).toBeNull();
        });
    });

    describe('crearUsuario', () => {
        it('debe crear y devolver solo datos públicos', async () => {
            const instancia = { ...datosFull, toUsuario: () => datosPublicos } as any;
            jest.spyOn(Usuario, 'create').mockResolvedValue(instancia);
            const datosInsert = { cUsuario: 'JohnDoe', nRol: 2, cNombres: 'John', cApellidos: 'Doe', cPassword: 'securepassword' };
            const resultado = await UsuarioService.crearUsuario(datosInsert);
            expect(resultado).toEqual(datosPublicos);
        });
    });

    describe('actualizarUsuario', () => {
        it('debe actualizar campos y devolver datos públicos actualizados', async () => {
            const cambios = { cNombres: 'Jane', cApellidos: 'Doe' };
            const instancia: any = { ...datosFull };
            instancia.toUsuario = () => ({
                nUsuario: instancia.nUsuario,
                cUsuario: instancia.cUsuario,
                nRol: instancia.nRol,
                bActivo: instancia.bActivo,
                cNombres: instancia.cNombres,
                cApellidos: instancia.cApellidos,
            });
            instancia.update = jest.fn().mockImplementation(async (cambios) => {
                Object.assign(instancia, cambios);
                return instancia;
            });
            jest.spyOn(Usuario, 'findByPk').mockResolvedValue(instancia);
            const resultado = await UsuarioService.actualizarUsuario(1, cambios);
            expect(instancia.update).toHaveBeenCalledWith(cambios);
            expect(resultado).toEqual({
                ...datosPublicos,
                ...cambios,
            });
        });

        it('debe lanzar NoEntryError si no existe', async () => {
            jest.spyOn(Usuario, 'findByPk').mockResolvedValue(null);
            await expect(UsuarioService.actualizarUsuario(1, { cNombres: 'X' })).rejects.toThrow(NoEntryError);
        });
    });
});
