import { getUser } from '@services/userService.js';

describe('userService', () => {
  it('deve retornar usuário de exemplo via service', () => {
    expect(getUser()).toEqual({ id: 1, name: 'Usuário Exemplo' });
  });
});
