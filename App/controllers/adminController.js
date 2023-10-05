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

    async deleteUser(req, res, next) {
        const userId = req.params.id;
        try {
            const user = await User.findByPk(userId);
            if (!user) {
                throw new Error('User was not found')
            }
            await user.destroy();
            return res.status(204).send();
        } catch (err) {
            next(err);
        }
    }

    async editUser(req, res, next) {
        const userId = req.params.id;
        const newEmail = req.body.newEmail;
        try {
            const user = await User.findByPk(userId);
            if (!user) {
                throw new Error('User was not found')
            }
            await user.update({ email: newEmail });
            return res.status(200).send();
        } catch (err) {
            next(err);
        }
    }

    async editUserStatus(req, res, next) {
        const userId = req.params.id;
        try {
            const user = await User.findByPk(userId);
            if (!user) {
                throw new Error('User was not found')
            }

            user.status = !user.status;
            await user.save();

            return res.status(200).send();
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new adminController()