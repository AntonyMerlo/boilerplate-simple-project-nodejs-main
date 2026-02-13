import { getUser as getUserService } from '../services/userService.js';

export const getUser = (req, res) => {
  const user = getUserService();
  res.json(user);
};
