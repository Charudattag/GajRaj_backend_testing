import { DataTypes, FLOAT, INTEGER } from 'sequelize';
import sequelize from '../config/db.js';
import Category from '../models/categories.js';
import Subcategory from '../models/subcategories.js';
import User from '../models/user.js';

const Product = sequelize.define(
  'Product',
  {
    name: {
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
    subcategory_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Subcategory,
        key: 'id',
      },
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Weight: {
      type: FLOAT,
      allowNull: false,
    },
    shipping: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    packaging: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    making_Charges: {
      type: DataTypes.FLOAT,
      allowNull: true,
      // validate: {
      //   isFloat: true,
      //   min: 0,
      // },
    },
    making_charges_type: {
      type: DataTypes.ENUM('percentage', 'per_gram'),
      allowNull: false,
      defaultValue: 'percentage',
    },
    type: {
      type: DataTypes.ENUM('Gold', 'Silver'),
      allowNull: false,
    },
    GstPercentage: {
      type: DataTypes.FLOAT,
      allowNull: true,
      validate: {
        isInt: true,
        min: 0,
        max: 100,
      },
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
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
    timestamps: true,
    tableName: 'product',
  },
);

// Define relationships
Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });
Product.belongsTo(Subcategory, {
  foreignKey: 'subcategory_id',
  as: 'subcategory',
});
Product.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
Product.belongsTo(User, { foreignKey: 'updatedBy', as: 'updater' });


export default Product;
