import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Category from './categories.js';
import User from './user.js';

const Subcategory = sequelize.define(
  'Subcategory',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Name is required',
        },
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    SubCategory_banner: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Category,
        key: 'id',
      },
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    updatedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt`
    tableName: 'subcategories', // Explicit table name
  },
);

// Define relationships
Category.hasMany(Subcategory, { foreignKey: 'category_id' });
Subcategory.belongsTo(Category, { foreignKey: 'category_id' });

User.hasMany(Subcategory, { foreignKey: 'createdBy' });
User.hasMany(Subcategory, { foreignKey: 'updatedBy' });

Subcategory.belongsTo(User, { foreignKey: 'createdBy' });
Subcategory.belongsTo(User, { foreignKey: 'updatedBy' });

export default Subcategory;
