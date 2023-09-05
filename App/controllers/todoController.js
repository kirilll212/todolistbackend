const Todo = require('../models/todo');
const User = require('../models/user');
const config = require('../util/config')

class TodoController {
  async getTodo(req, res, next) {
    try {
      const user = await User.findByPk(req.userData.userId, {
        include: Todo,
      });

      if (!user) {
        throw new Error('User not found!')
      }

      res.json(user.todos);
    } catch (err) {
      next(err)
    }
  }

  async updateTodo(req, res, next) {
    const id = req.params.id;
    const { todo, completed } = req.body;

    try {
      const todoInstance = await Todo.findByPk(id);

      if (!todoInstance) {
        throw new Error(`Todo with id - ${id} not found`)
      }

      if (typeof todo !== 'string' || typeof completed !== 'boolean') {
        throw new Error('Invalid input data!')
      }

      await todoInstance.update({ todo, completed });

      res.json({ message: `Todo with id - ${id} updated successfully` });
    } catch (err) {
      next(err)
    }
  }

  async deleteTodo(req, res, next) {
    const id = req.params.id;

    try {
      const todoInstance = await Todo.findByPk(id);

      if (!todoInstance) {
        throw new Error(`Todo with id - ${id} not found`)
      }

      await todoInstance.destroy();

      res.json({ message: `Todo with id - ${id} deleted successfully` });
    } catch (err) {
      next(err)
    }
  }

  async createTodo(req, res, next) {
    const { todo } = req.body;

    try {
      const user = await User.findByPk(req.userData.userId);

      if (!user) {
        throw new Error('User not found!')
      }

      if (typeof todo !== 'string') {
        throw new Error('Invalid input data')
      }

      const createdTodo = await user.createTodo({
        todo: todo,
      });

      res.status(201).json({ message: 'Todo added successfully', todo: createdTodo });
    } catch (err) {
      next(err)
    }
  }
}

module.exports = new TodoController();