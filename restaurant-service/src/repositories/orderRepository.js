import pool from './db.js';

const mapOrderRows = (rows) => {
  const byId = new Map();

  rows.forEach((row) => {
    if (!byId.has(row.id)) {
      byId.set(row.id, {
        id: row.id,
        orderNumber: row.order_number,
        customerName: row.customer_name,
        tableNumber: row.table_number,
        status: row.status,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        items: []
      });
    }

    if (row.item_id) {
      byId.get(row.id).items.push({
        id: row.item_id,
        dishName: row.dish_name,
        quantity: row.quantity
      });
    }
  });

  return Array.from(byId.values());
};

export const createOrder = async ({ orderNumber, customerName, tableNumber, status, items }) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [result] = await connection.execute(
      'INSERT INTO orders (order_number, customer_name, table_number, status) VALUES (?, ?, ?, ?)',
      [orderNumber, customerName, tableNumber, status]
    );

    const orderId = result.insertId;

    for (const item of items) {
      await connection.execute(
        'INSERT INTO order_items (order_id, dish_name, quantity) VALUES (?, ?, ?)',
        [orderId, item.dishName, item.quantity]
      );
    }

    await connection.commit();
    return findOrderById(orderId);
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};

export const listOrders = async () => {
  const [rows] = await pool.execute(
    `SELECT o.id, o.order_number, o.customer_name, o.table_number, o.status, o.created_at, o.updated_at,
            i.id AS item_id, i.dish_name, i.quantity
     FROM orders o
     LEFT JOIN order_items i ON i.order_id = o.id
     ORDER BY o.id DESC, i.id ASC`
  );

  return mapOrderRows(rows);
};

export const findOrderById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT o.id, o.order_number, o.customer_name, o.table_number, o.status, o.created_at, o.updated_at,
            i.id AS item_id, i.dish_name, i.quantity
     FROM orders o
     LEFT JOIN order_items i ON i.order_id = o.id
     WHERE o.id = ?`,
    [id]
  );

  const orders = mapOrderRows(rows);
  return orders[0] || null;
};

export const updateOrder = async (id, { orderNumber, customerName, tableNumber, status, items }) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const updates = [];
    const values = [];

    if (orderNumber !== undefined) {
      updates.push('order_number = ?');
      values.push(orderNumber);
    }

    if (customerName !== undefined) {
      updates.push('customer_name = ?');
      values.push(customerName);
    }

    if (tableNumber !== undefined) {
      updates.push('table_number = ?');
      values.push(tableNumber);
    }

    if (status !== undefined) {
      updates.push('status = ?');
      values.push(status);
    }

    if (updates.length) {
      values.push(id);
      await connection.execute(`UPDATE orders SET ${updates.join(', ')} WHERE id = ?`, values);
    }

    if (items) {
      await connection.execute('DELETE FROM order_items WHERE order_id = ?', [id]);
      for (const item of items) {
        await connection.execute(
          'INSERT INTO order_items (order_id, dish_name, quantity) VALUES (?, ?, ?)',
          [id, item.dishName, item.quantity]
        );
      }
    }

    await connection.commit();
    return findOrderById(id);
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};

export const deleteOrder = async (id) => {
  const [result] = await pool.execute('DELETE FROM orders WHERE id = ?', [id]);
  return result.affectedRows > 0;
};
