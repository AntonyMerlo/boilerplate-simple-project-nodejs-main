import {
  getUserById,
  listUsers,
  updateUser,
  deleteUser
} from '../services/userService.js';

export const list = async (req, res, next) => {
  try {
    const users = await listUsers();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

export const getById = async (req, res, next) => {
  try {
    const user = await getUserById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const user = await updateUser(req.params.id, req.body);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    await deleteUser(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
