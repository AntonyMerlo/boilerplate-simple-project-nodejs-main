import pool from './db.js';

export const createUser = async ({ email, name, passwordHash }) => {
  const [result] = await pool.execute(
    'INSERT INTO users (email, name, password_hash) VALUES (?, ?, ?)',
    [email, name, passwordHash]
  );

  const [rows] = await pool.execute(
    'SELECT id, email, name, password_hash AS passwordHash, created_at AS createdAt FROM users WHERE id = ?',
    [result.insertId]
  );

  return rows[0] || null;
};

export const findUserByEmail = async (email) => {
  const [rows] = await pool.execute(
    'SELECT id, email, name, password_hash AS passwordHash, created_at AS createdAt FROM users WHERE email = ? LIMIT 1',
    [email]
  );

  return rows[0] || null;
};

export const findUserById = async (id) => {
  const [rows] = await pool.execute(
    'SELECT id, email, name, password_hash AS passwordHash, created_at AS createdAt FROM users WHERE id = ? LIMIT 1',
    [id]
  );

  return rows[0] || null;
};

export const deleteUserById = async (id) => {
  const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

export const saveRefreshToken = async (userId, refreshToken) => {
  await pool.execute(
    'INSERT INTO refresh_tokens (user_id, token) VALUES (?, ?) ON DUPLICATE KEY UPDATE token = VALUES(token), created_at = CURRENT_TIMESTAMP',
    [userId, refreshToken]
  );
};

export const getRefreshToken = async (userId) => {
  const [rows] = await pool.execute(
    'SELECT token FROM refresh_tokens WHERE user_id = ? LIMIT 1',
    [userId]
  );

  return rows[0]?.token || null;
};
