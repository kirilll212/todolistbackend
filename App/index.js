const express = require('express')
const sequelize = require('./util/database')
const userRoute = require('./routes/users')
const todoRoute = require('./routes/todos')
const Router = express.Router;
const router = new Router();
const app = express()
const port = process.env.PORT || 3000

app.use(express.json());

app.use('/users', userRoute(router))
app.use('/todos', todoRoute(router))

sequelize.sync().then(() => {
    console.log('Database connected');
    app.listen(port, () => {
        console.log(`App running on port ${port}!`);
    });
}).catch(err => {
    console.log(err);
});