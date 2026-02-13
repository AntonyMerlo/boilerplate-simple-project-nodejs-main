const openapi = {
  openapi: '3.0.0',
  info: {
    title: 'Auth Service',
    version: '1.0.0'
  },
  servers: [{ url: 'http://localhost:3000' }],
  paths: {
    '/auth/register': {
      post: {
        summary: 'Registrar usuário',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string' },
                  password: { type: 'string' }
                }
              }
            }
          }
        },
        responses: { '201': { description: 'Criado' } }
      }
    },
    '/auth/login': {
      post: {
        summary: 'Login',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string' },
                  password: { type: 'string' }
                }
              }
            }
          }
        },
        responses: { '200': { description: 'OK' } }
      }
    },
    '/auth/refresh': {
      post: {
        summary: 'Refresh token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['token'],
                properties: {
                  token: { type: 'string' }
                }
              }
            }
          }
        },
        responses: { '200': { description: 'OK' } }
      }
    },
    '/auth/me': {
      get: {
        summary: 'Perfil do usuário',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'OK' } }
      }
    }
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer'
      }
    }
  }
};

export default openapi;
