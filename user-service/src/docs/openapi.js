const openapi = {
  openapi: '3.0.0',
  info: {
    title: 'User Service',
    version: '1.0.0'
  },
  servers: [{ url: 'http://localhost:3001' }],
  paths: {
    '/user': {
      get: {
        summary: 'Listar usuários',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'OK' } }
      }
    },
    '/user/{id}': {
      get: {
        summary: 'Buscar usuário por ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        responses: { '200': { description: 'OK' } }
      },
      put: {
        summary: 'Atualizar usuário',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string' },
                  phone: { type: 'string' },
                  status: { type: 'string' }
                }
              }
            }
          }
        },
        responses: { '200': { description: 'OK' } }
      },
      delete: {
        summary: 'Remover usuário',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        responses: { '204': { description: 'No Content' } }
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
