const Todo = require('../models/todo')
const User = require('../models/user')

class adminController {
    async renderTodoList(req, res, next) {
        try {
            const todos = await Todo.findAll()
            res.render('partials/todos', { todos })
        } catch (err) {
            next(err)
        }
    }
    async renderUserList(req, res, next) {
        try {
            const users = await User.findAll()
            res.render('partials/users', { users })
        } catch (err) {
            next(err)
        }
    }
}

module.exports = new adminController()