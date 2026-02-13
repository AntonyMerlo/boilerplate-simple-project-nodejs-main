import { getUser } from '@repositories/userRepository.js';

describe('userRepository', () => {
  it('deve retornar usuário de exemplo', () => {
    expect(getUser()).toEqual({ id: 1, name: 'Usuário Exemplo' });
  });
});
