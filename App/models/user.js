const Sequelize = require('sequelize')
const db = require('../util/database')
const Todo = require('./todo')

const User = db.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    }
})

User.hasMany(Todo, {onDelete: 'CASCADE'})

module.exports = User