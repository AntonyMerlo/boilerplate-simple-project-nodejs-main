import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';

import routes from './src/routes/index.js';
import openapi from './src/docs/openapi.js';

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3000;

// Rotas agrupadas
app.use(routes);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapi));

// Middleware de erro
app.use((err, req, res, _next) => {
  const status = err.statusCode || 500;
  const message = err.message || 'Erro interno.';
  res.status(status).json({ message });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
