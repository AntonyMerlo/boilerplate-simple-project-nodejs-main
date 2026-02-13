import { getUser as getUserRepository } from '../repositories/userRepository.js';

export const getUser = () => {
  return getUserRepository();
};
