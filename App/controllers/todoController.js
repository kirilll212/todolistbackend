const Todo = require('../models/todo');
class TodoController {
  async getTodo(req, res) {
    try {
      const todos = await Todo.findAll();
      res.json(todos);
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
      await Todo.create({ todo: todo });
      res.status(201).json({ message: 'Todo added successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new TodoController();