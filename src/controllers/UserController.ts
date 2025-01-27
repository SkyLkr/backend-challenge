import debug from 'debug';
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { User } from '../entity/User';
import { generateAccessToken } from '../utils/accessToken';
import { compareHashedPassword, generateHashedPassword } from '../utils/hashPassword';
import prettifyPromise from '../utils/prettifyPromise';

const log = debug('api:controllers:user');

export default class UserController {
  static async create(request: Request, response: Response) {
    const { name, email, password } = request.body;

    const userRepository = getRepository(User);

    const userExists = await userRepository.findOne({ where: { email } });

    if (userExists) {
      return response.status(409).json({ error: 'Já existe um usuário cadastrado com o mesmo email' });
    }

    const [hashedPassword, passwordError] = await prettifyPromise(generateHashedPassword(password));

    const [user, saveUserError] = await prettifyPromise(userRepository.save({ name, email, password: hashedPassword }));
  
    if (passwordError || saveUserError) {
      log((passwordError || saveUserError).stack);
      return response.status(400).json({ error: 'Erro ao criar usuário' });
    }

    return response.status(201).json(user);
  }

  static async authenticate(request: Request, response: Response) {
    const { name, email, password } = request.body;

    const userRepository = getRepository(User);

    const [user, findUserError] = await prettifyPromise(userRepository.findOneOrFail({ where: { name, email } }));

    if (findUserError) {
      log(findUserError);
      return response.status(404).json({ error: 'Usuário não encontrado' });
    }

    const passwordIsValid = await compareHashedPassword(password, user.password);

    if (!passwordIsValid) {
      return response.status(403).json({ error: 'Senha inválida' });
    }

    const [token, generateJwtError] = await prettifyPromise(generateAccessToken(user));

    if (generateJwtError) {
      log(generateJwtError.stack);
      return response.status(500).json({ error: 'Erro na autenticação do usuário' });
    }

    return response.json({ token });
  }
}