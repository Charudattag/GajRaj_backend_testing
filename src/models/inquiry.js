import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './user.js';

const Inquiry = sequelize.define(
  'inquiries',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isNumeric: true,
      },
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    Status: {
      type: DataTypes.ENUM('PENDING', 'IN-PROGRESS', 'RESOLVED'),
      allowNull: false,
      defaultValue: 'PENDING',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
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
    tableName: 'inquiries',
  },
);

User.hasMany(Inquiry, { foreignKey: 'createdBy' });
Inquiry.belongsTo(User, { foreignKey: 'createdBy' });

User.hasMany(Inquiry, { foreignKey: 'updatedBy' });
Inquiry.belongsTo(User, { foreignKey: 'updatedBy' });

export default Inquiry;
