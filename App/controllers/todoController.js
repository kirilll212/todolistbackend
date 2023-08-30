const Todo = require('../models/todo');
const User = require('../models/user');

class TodoController {
  async getTodo(req, res) {
    try {
      const user = await User.findByPk(req.userData.userId, {
        include: Todo,
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(user.todos);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async updateTodo(req, res) {
    const id = req.params.id;
    const { todo, completed } = req.body;

    try {
      const todoInstance = await Todo.findByPk(id);

      if (!todoInstance) {
        return res.status(404).json({ message: `Todo with id - ${id} not found` });
      }

      await todoInstance.update({ todo, completed });

      res.json({ message: `Todo with id - ${id} updated successfully` });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async deleteTodo(req, res) {
    const id = req.params.id;

    try {
      const todoInstance = await Todo.findByPk(id);

      if (!todoInstance) {
        return res.status(404).json({ message: `Todo with id - ${id} not found` });
      }

      await todoInstance.destroy();

      res.json({ message: `Todo with id - ${id} deleted successfully` });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async createTodo(req, res) {
    const { todo } = req.body;

    try {
      const user = await User.findByPk(req.userData.userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const createdTodo = await user.createTodo({
        todo: todo,
      });

      res.status(201).json({ message: 'Todo added successfully', todo: createdTodo });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new TodoController();