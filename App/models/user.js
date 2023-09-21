const { DataTypes, Model } = require('sequelize');
const db = require('../util/database');
const Todo = require('./todo');

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize: db,
    modelName: 'User',
    tableName: 'users',
  }
);

User.hasMany(Todo, {
  onDelete: 'CASCADE',
  foreignKey: 'userId',
});

module.exports = User;
