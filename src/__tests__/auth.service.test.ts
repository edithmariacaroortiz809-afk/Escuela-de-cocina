import { AppError } from '../errors/AppError.js';

jest.mock('bcrypt');
jest.mock('../repositories/users.repository.js');
jest.mock('../utils/jwt.js');

import bcrypt from 'bcrypt';
import * as usersRepository from '../repositories/users.repository.js';
import * as jwtUtils from '../utils/jwt.js';
import * as authService from '../services/auth.service.js';

const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
const mockedRepo = usersRepository as jest.Mocked<typeof usersRepository>;
const mockedJwt = jwtUtils as jest.Mocked<typeof jwtUtils>;

describe('AuthService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('registra un usuario nuevo con contraseña encriptada', async () => {
      mockedRepo.findUserByEmail.mockResolvedValue(null);
      mockedBcrypt.hash.mockResolvedValue('hashed-password' as never);
      mockedRepo.createUser.mockResolvedValue({
        _id: '1',
        name: 'Ana',
        email: 'ana@test.com',
        role: 'user',
      } as any);

      const result = await authService.register({
        name: 'Ana',
        email: 'ana@test.com',
        password: 'Password1',
      });

      expect(mockedBcrypt.hash).toHaveBeenCalledWith('Password1', 12);
      expect(mockedRepo.createUser).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'ana@test.com', password: 'hashed-password' })
      );
      expect(result.email).toBe('ana@test.com');
    });

    it('lanza AppError 409 si el email ya está registrado', async () => {
      mockedRepo.findUserByEmail.mockResolvedValue({ email: 'ana@test.com' } as any);

      await expect(
        authService.register({ name: 'Ana', email: 'ana@test.com', password: 'Password1' })
      ).rejects.toBeInstanceOf(AppError);
      await expect(
        authService.register({ name: 'Ana', email: 'ana@test.com', password: 'Password1' })
      ).rejects.toMatchObject({ statusCode: 409 });
      expect(mockedRepo.createUser).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('retorna tokens con credenciales válidas', async () => {
      mockedRepo.findUserByEmail.mockResolvedValue({
        _id: { toString: () => '1' },
        email: 'ana@test.com',
        password: 'hashed',
        role: 'user',
      } as any);
      mockedBcrypt.compare.mockResolvedValue(true as never);
      mockedJwt.signAccessToken.mockReturnValue('access-token');
      mockedJwt.signRefreshToken.mockReturnValue('refresh-token');
      mockedRepo.updateRefreshToken.mockResolvedValue(undefined);

      const result = await authService.login({ email: 'ana@test.com', password: 'Password1' });

      expect(result).toEqual({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        role: 'user',
      });
      expect(mockedRepo.updateRefreshToken).toHaveBeenCalledWith('1', 'refresh-token');
    });

    it('lanza AppError 401 si el usuario no existe', async () => {
      mockedRepo.findUserByEmail.mockResolvedValue(null);

      await expect(
        authService.login({ email: 'noexiste@test.com', password: 'Password1' })
      ).rejects.toMatchObject({ statusCode: 401 });
    });

    it('lanza AppError 401 si la contraseña es incorrecta', async () => {
      mockedRepo.findUserByEmail.mockResolvedValue({ password: 'hashed' } as any);
      mockedBcrypt.compare.mockResolvedValue(false as never);

      await expect(
        authService.login({ email: 'ana@test.com', password: 'wrong' })
      ).rejects.toMatchObject({ statusCode: 401 });
    });
  });

  describe('refreshTokens', () => {
    it('genera nuevos tokens con un refresh token válido', async () => {
      mockedJwt.verifyRefreshToken.mockReturnValue({ sub: '1' });
      mockedRepo.findUserById.mockResolvedValue({
        _id: { toString: () => '1' },
        email: 'ana@test.com',
        role: 'user',
      } as any);
      mockedJwt.signAccessToken.mockReturnValue('new-access');
      mockedJwt.signRefreshToken.mockReturnValue('new-refresh');

      const result = await authService.refreshTokens('valid-token');

      expect(result).toEqual({ accessToken: 'new-access', refreshToken: 'new-refresh' });
    });

    it('lanza AppError 401 si el token es inválido', async () => {
      mockedJwt.verifyRefreshToken.mockImplementation(() => {
        throw new Error('invalid');
      });

      await expect(authService.refreshTokens('bad-token')).rejects.toMatchObject({ statusCode: 401 });
    });

    it('lanza AppError 401 si el usuario ya no existe', async () => {
      mockedJwt.verifyRefreshToken.mockReturnValue({ sub: '1' });
      mockedRepo.findUserById.mockResolvedValue(null);

      await expect(authService.refreshTokens('valid-token')).rejects.toMatchObject({ statusCode: 401 });
    });
  });

  describe('logout', () => {
    it('limpia el refresh token del usuario', async () => {
      mockedRepo.updateRefreshToken.mockResolvedValue(undefined);

      await authService.logout('1');

      expect(mockedRepo.updateRefreshToken).toHaveBeenCalledWith('1', null);
    });
  });

  describe('getMe', () => {
    it('retorna los datos del usuario', async () => {
      mockedRepo.findUserById.mockResolvedValue({
        _id: '1',
        name: 'Ana',
        email: 'ana@test.com',
        role: 'user',
      } as any);

      const result = await authService.getMe('1');

      expect(result.email).toBe('ana@test.com');
    });

    it('lanza AppError 404 si el usuario no existe', async () => {
      mockedRepo.findUserById.mockResolvedValue(null);

      await expect(authService.getMe('missing')).rejects.toMatchObject({ statusCode: 404 });
    });
  });
});
