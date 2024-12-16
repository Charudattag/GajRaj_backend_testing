import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Customer from './customer.js';

const Address = sequelize.define(
  'Address',
  {
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Customer,
        key: 'id',
      },
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address_line_1: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address_line_2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pincode: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Customer, // Referencing the Customer model
        key: 'id',
      },
    },
    updatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Customer, // Referencing the Customer model
        key: 'id',
      },
    },
  },
  {
    timestamps: true,
    tableName: 'address',
  },
);

// Define Associations
Customer.hasMany(Address, { foreignKey: 'customer_id' });
Address.belongsTo(Customer, { foreignKey: 'customer_id' });

Customer.hasMany(Address, { foreignKey: 'createdBy' });
Address.belongsTo(Customer, { foreignKey: 'createdBy' });

Customer.hasMany(Address, { foreignKey: 'updatedBy' });
Address.belongsTo(Customer, { foreignKey: 'updatedBy' });

export default Address;
