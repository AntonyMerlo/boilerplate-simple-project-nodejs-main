import Joi from 'joi';
import {
  createOrder as createOrderRepository,
  listOrders as listOrdersRepository,
  findOrderById,
  updateOrder as updateOrderRepository,
  deleteOrder as deleteOrderRepository
} from '../repositories/orderRepository.js';

const itemSchema = Joi.object({
  dishName: Joi.string().min(2).max(120).required(),
  quantity: Joi.number().integer().min(1).required()
});

const createSchema = Joi.object({
  orderNumber: Joi.string().min(1).max(50).required(),
  customerName: Joi.string().min(2).max(120).required(),
  tableNumber: Joi.string().min(1).max(20).required(),
  status: Joi.string().valid('open', 'in_progress', 'ready', 'closed').default('open'),
  items: Joi.array().min(1).items(itemSchema).required()
});

const updateSchema = Joi.object({
  orderNumber: Joi.string().min(1).max(50),
  customerName: Joi.string().min(2).max(120),
  tableNumber: Joi.string().min(1).max(20),
  status: Joi.string().valid('open', 'in_progress', 'ready', 'closed'),
  items: Joi.array().min(1).items(itemSchema)
});

export const createOrder = async (payload) => {
  const { error, value } = createSchema.validate(payload);
  if (error) {
    const err = new Error(error.details?.[0]?.message || 'Dados inválidos.');
    err.statusCode = 400;
    throw err;
  }

  return createOrderRepository(value);
};

export const listOrders = async () => {
  return listOrdersRepository();
};

export const getOrderById = async (id) => {
  const order = await findOrderById(Number(id));
  if (!order) {
    const err = new Error('Comanda não encontrada.');
    err.statusCode = 404;
    throw err;
  }
  return order;
};

export const updateOrder = async (id, payload) => {
  const { error, value } = updateSchema.validate(payload);
  if (error) {
    const err = new Error(error.details?.[0]?.message || 'Dados inválidos.');
    err.statusCode = 400;
    throw err;
  }

  const updated = await updateOrderRepository(Number(id), value);
  if (!updated) {
    const err = new Error('Comanda não encontrada.');
    err.statusCode = 404;
    throw err;
  }
  return updated;
};

export const deleteOrder = async (id) => {
  const success = await deleteOrderRepository(Number(id));
  if (!success) {
    const err = new Error('Comanda não encontrada.');
    err.statusCode = 404;
    throw err;
  }
  return true;
};
