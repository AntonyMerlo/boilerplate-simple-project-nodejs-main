import {
  createOrder,
  listOrders,
  getOrderById,
  updateOrder,
  deleteOrder
} from '../services/orderService.js';

export const create = async (req, res, next) => {
  try {
    const order = await createOrder(req.body);
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

export const list = async (req, res, next) => {
  try {
    const orders = await listOrders();
    res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
};

export const getById = async (req, res, next) => {
  try {
    const order = await getOrderById(req.params.id);
    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const order = await updateOrder(req.params.id, req.body);
    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    await deleteOrder(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
