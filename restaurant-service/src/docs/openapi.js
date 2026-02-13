const openapi = {
  openapi: '3.0.0',
  info: {
    title: 'Restaurant Service',
    version: '1.0.0'
  },
  servers: [{ url: 'http://localhost:3002' }],
  paths: {
    '/orders': {
      get: {
        summary: 'Listar comandas',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'OK' } }
      },
      post: {
        summary: 'Criar comanda',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['orderNumber', 'customerName', 'tableNumber', 'items'],
                properties: {
                  orderNumber: { type: 'string' },
                  customerName: { type: 'string' },
                  tableNumber: { type: 'string' },
                  status: { type: 'string' },
                  items: {
                    type: 'array',
                    items: {
                      type: 'object',
                      required: ['dishName', 'quantity'],
                      properties: {
                        dishName: { type: 'string' },
                        quantity: { type: 'integer' }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        responses: { '201': { description: 'Criado' } }
      }
    },
    '/orders/{id}': {
      get: {
        summary: 'Buscar comanda por ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        responses: { '200': { description: 'OK' } }
      },
      put: {
        summary: 'Atualizar comanda',
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
                  orderNumber: { type: 'string' },
                  customerName: { type: 'string' },
                  tableNumber: { type: 'string' },
                  status: { type: 'string' },
                  items: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        dishName: { type: 'string' },
                        quantity: { type: 'integer' }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        responses: { '200': { description: 'OK' } }
      },
      delete: {
        summary: 'Remover comanda',
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
