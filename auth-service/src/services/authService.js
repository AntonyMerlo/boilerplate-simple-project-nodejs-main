import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import {
  createUser,
  findUserByEmail,
  findUserById,
  saveRefreshToken,
  getRefreshToken,
  deleteUserById
} from '../repositories/authRepository.js';

const JWT_SECRET = process.env.JWT_SECRET || 'change-me';
const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || '15m';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://44.202.218.58:3001';

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required()
});

const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
};

const verifyPassword = (password, passwordHash) => {
  const [salt, originalHash] = passwordHash.split(':');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(originalHash, 'hex'));
};

const generateAccessToken = (user) => {
  return jwt.sign(
    { sub: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { sub: user.id, type: 'refresh' },
    JWT_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
  );
};

const syncUserProfile = async ({ authUserId, name, email }) => {
  const response = await fetch(`${USER_SERVICE_URL}/user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ authUserId, name, email, status: 'active' })
  });

  if (!response.ok) {
    let message = 'Falha ao sincronizar usuário.';
    try {
      const data = await response.json();
      if (data?.message) {
        message = data.message;
      }
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      // ignore parse errors
    }
    const error = new Error(message);
    error.statusCode = 502;
    throw error;
  }

  return response.json();
};

export const registerUser = async (payload) => {
  const { error, value } = registerSchema.validate(payload);
  if (error) {
    const message = error.details?.[0]?.message || 'Dados inválidos.';
    const err = new Error(message);
    err.statusCode = 400;
    throw err;
  }

  const existing = await findUserByEmail(value.email);
  if (existing) {
    const err = new Error('E-mail já cadastrado.');
    err.statusCode = 409;
    throw err;
  }

  const passwordHash = hashPassword(value.password);
  const user = await createUser({
    email: value.email,
    name: value.name,
    passwordHash
  });

  try {
    await syncUserProfile({ authUserId: user.id, name: user.name, email: user.email });
  } catch (err) {
    await deleteUserById(user.id);
    throw err;
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  await saveRefreshToken(user.id, refreshToken);

  return {
    user: { id: user.id, email: user.email, name: user.name },
    accessToken,
    refreshToken
  };
};

export const loginUser = async (payload) => {
  const { error, value } = loginSchema.validate(payload);
  if (error) {
    const message = error.details?.[0]?.message || 'Dados inválidos.';
    const err = new Error(message);
    err.statusCode = 400;
    throw err;
  }

  const user = await findUserByEmail(value.email);
  if (!user || !verifyPassword(value.password, user.passwordHash)) {
    const err = new Error('Credenciais inválidas.');
    err.statusCode = 401;
    throw err;
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  await saveRefreshToken(user.id, refreshToken);

  return {
    user: { id: user.id, email: user.email, name: user.name },
    accessToken,
    refreshToken
  };
};

export const refreshToken = async (payload) => {
  const schema = Joi.object({ token: Joi.string().required() });
  const { error, value } = schema.validate(payload);
  if (error) {
    const message = error.details?.[0]?.message || 'Dados inválidos.';
    const err = new Error(message);
    err.statusCode = 400;
    throw err;
  }

  let decoded;
  try {
    decoded = jwt.verify(value.token, JWT_SECRET);
    // eslint-disable-next-line no-unused-vars
  } catch (err) {
    const errorObj = new Error('Refresh token inválido.');
    errorObj.statusCode = 401;
    throw errorObj;
  }

  if (decoded.type !== 'refresh') {
    const err = new Error('Refresh token inválido.');
    err.statusCode = 401;
    throw err;
  }

  const storedToken = await getRefreshToken(decoded.sub);
  if (!storedToken || storedToken !== value.token) {
    const err = new Error('Refresh token inválido.');
    err.statusCode = 401;
    throw err;
  }

  const user = await findUserById(decoded.sub);
  if (!user) {
    const err = new Error('Usuário não encontrado.');
    err.statusCode = 404;
    throw err;
  }

  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);
  await saveRefreshToken(user.id, newRefreshToken);

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken
  };
};

export const getMe = async (userId) => {
  const user = await findUserById(userId);
  if (!user) {
    const err = new Error('Usuário não encontrado.');
    err.statusCode = 404;
    throw err;
  }

  return { id: user.id, email: user.email, name: user.name };
};

export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
    // eslint-disable-next-line no-unused-vars
  } catch (err) {
    const errorObj = new Error('Token inválido.');
    errorObj.statusCode = 401;
    throw errorObj;
  }
};
