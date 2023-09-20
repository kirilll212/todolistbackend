const { DataTypes, Model } = require('sequelize');
const db = require('../util/database');

class Todo extends Model {}

Todo.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    todo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize: db,
    modelName: 'Todo',
    tableName: 'todos',
  }
);

module.exports = Todo;