import pool from './db.js';

export const findUserById = async (id) => {
  const [rows] = await pool.execute(
    'SELECT id, name, email, phone, status, created_at AS createdAt, updated_at AS updatedAt FROM users WHERE id = ? LIMIT 1',
    [id]
  );

  return rows[0] || null;
};

export const findUserByEmail = async (email) => {
  const [rows] = await pool.execute(
    'SELECT id, name, email, phone, status, created_at AS createdAt, updated_at AS updatedAt FROM users WHERE email = ? LIMIT 1',
    [email]
  );

  return rows[0] || null;
};

export const listUsers = async () => {
  const [rows] = await pool.execute(
    'SELECT id, name, email, phone, status, created_at AS createdAt, updated_at AS updatedAt FROM users ORDER BY id DESC'
  );

  return rows;
};

export const updateUser = async (id, fields) => {
  const updates = [];
  const values = [];

  Object.entries(fields).forEach(([key, value]) => {
    if (value === undefined) {
      return;
    }

    const map = {
      name: 'name',
      email: 'email',
      phone: 'phone',
      status: 'status'
    };

    if (map[key]) {
      updates.push(`${map[key]} = ?`);
      values.push(value);
    }
  });

  if (!updates.length) {
    return findUserById(id);
  }

  values.push(id);
  await pool.execute(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values);

  return findUserById(id);
};

export const deleteUser = async (id) => {
  const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

