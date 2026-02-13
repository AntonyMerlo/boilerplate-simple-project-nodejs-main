import {
  registerUser,
  loginUser,
  refreshToken as refreshTokenService,
  getMe
} from '../services/authService.js';

export const register = async (req, res, next) => {
  try {
    const result = await registerUser(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await loginUser(req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const result = await refreshTokenService(req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const me = async (req, res, next) => {
  try {
    const user = await getMe(req.userId);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};
