const todoController = require('../controllers/todoController');

module.exports = (router) => {
    router.get('/list', todoController.getTodo);
    router.post('/create', todoController.createTodo);
    router.put('/update/:id', todoController.updateTodo);
    router.delete('/delete/:id', todoController.deleteTodo);

    return router;
};