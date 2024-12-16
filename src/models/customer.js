import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Customer = sequelize.define(
  'Customer',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isNumeric: true,
        len: [10, 15],
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mobile_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    email_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    email_otp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mobile_otp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    otp_expires_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: 'customer',
  },
);

export default Customer;
