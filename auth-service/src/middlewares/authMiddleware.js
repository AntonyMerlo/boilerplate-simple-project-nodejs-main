import { verifyAccessToken } from '../services/authService.js';

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Token não fornecido.' });
  }

  try {
    const decoded = verifyAccessToken(token);
    req.userId = decoded.sub;
    return next();
  } catch (err) {
    const status = err.statusCode || 401;
    return res.status(status).json({ message: err.message || 'Token inválido.' });
  }
};
