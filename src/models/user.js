import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const User = sequelize.define(
  'Users',
  {
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('ADMIN', 'MARKETING'),
      defaultValue: 'ADMIN',
      validate: {
        isIn: {
          args: [['ADMIN', 'MARKETING']],
        },
      },
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    }
  },

  {
    timestamps: true,
    tableName: 'users',
  },
);

export default User;
