const express = require('express')
const sequelize = require('./util/database')
const userRoute = require('./routes/users')
const todoRoute = require('./routes/todos')
const authMiddleware = require('./controllers/middleware/authMiddleware')
const errorMiddleware = require('./controllers/middleware/errorMiddleware')
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const Router = express.Router;
const router = new Router();
const app = express()
const port = process.env.PORT || 3000

app.use(express.json());
app.use('/admin', express.static(__dirname + '/public/admin'))

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      version: '1.0.0',
      title: 'Todo API',
      description: 'API for managing todo items.',
    },
  },
  apis: [__dirname + '/util/swagger.yaml'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorMiddleware)

app.use('/users', userRoute(router))
app.use('/todos', authMiddleware, todoRoute(router))

sequelize.sync().then(() => {
  console.log('Database connected');
  app.listen(port, () => {
    console.log(`App running on port ${port}!`);
  });
}).catch(err => {
  console.log(err);
});