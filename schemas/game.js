const { DataTypes } = require('sequelize')
const { dbConnect } = require('../db/index')
// const CategoriaArt = require('./categoriaArticulo');
const User = require('./user')
const Game = dbConnect.define(
  'Game',
  {
    id: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.BIGINT,
      autoIncrement: true
    },
    finalState: DataTypes.STRING(250),
    nivel: DataTypes.STRING(250),
    palabraAdivinar: DataTypes.STRING(250),
    time: DataTypes.INTEGER,
    TIMER: DataTypes.INTEGER,
    MAX_INTENTOS: DataTypes.INTEGER,
    intentos: DataTypes.INTEGER,
    date: DataTypes.DATE,
    withTimer: DataTypes.BOOLEAN,
    UserId: DataTypes.BIGINT,
    allInputs: DataTypes.JSON,
    letrasErradas: DataTypes.JSON,
    palabraUsuario: DataTypes.JSON,

  },
  {
    tableName: 'games',
    timestamps: true,

  }
)

Game.belongsTo(User, { foreignKey: { allowNull: false } })
User.hasMany(Game)

module.exports = Game
