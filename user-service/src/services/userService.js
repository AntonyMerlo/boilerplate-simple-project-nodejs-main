import Joi from 'joi';
import {
  findUserById,
  findUserByEmail,
  listUsers as listUsersRepository,
  updateUser as updateUserRepository,
  deleteUser as deleteUserRepository
} from '../repositories/userRepository.js';

const updateSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  email: Joi.string().email(),
  phone: Joi.string().max(30).allow(null, ''),
  status: Joi.string().valid('active', 'inactive')
});

export const getUserById = async (id) => {
  const user = await findUserById(Number(id));
  if (!user) {
    const err = new Error('Usuário não encontrado.');
    err.statusCode = 404;
    throw err;
  }
  return user;
};

export const listUsers = async () => {
  return listUsersRepository();
};

export const updateUser = async (id, payload) => {
  const { error, value } = updateSchema.validate(payload);
  if (error) {
    const err = new Error(error.details?.[0]?.message || 'Dados inválidos.');
    err.statusCode = 400;
    throw err;
  }

  if (value.email) {
    const existing = await findUserByEmail(value.email);
    if (existing && Number(existing.id) !== Number(id)) {
      const err = new Error('E-mail já cadastrado.');
      err.statusCode = 409;
      throw err;
    }
  }

  const updated = await updateUserRepository(Number(id), value);
  if (!updated) {
    const err = new Error('Usuário não encontrado.');
    err.statusCode = 404;
    throw err;
  }
  return updated;
};

export const deleteUser = async (id) => {
  const success = await deleteUserRepository(Number(id));
  if (!success) {
    const err = new Error('Usuário não encontrado.');
    err.statusCode = 404;
    throw err;
  }
  return true;
};

