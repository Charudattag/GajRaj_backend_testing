import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './user.js';

const Category = sequelize.define(
  'categories',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Category_Banner: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: 'id',
      },
    },
    updatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  {
    timestamps: true,
    tableName: 'categories',
  },
);

User.hasMany(Category, { foreignKey: 'createdBy' });
Category.belongsTo(User, { foreignKey: 'createdBy' });

User.hasMany(Category, { foreignKey: 'updatedBy' });
Category.belongsTo(User, { foreignKey: 'updatedBy' });

export default Category;
