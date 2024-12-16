import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './user.js';

const Rate = sequelize.define(
  'Gold_Rate',
  {
    Gold: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Silver: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    rateDate: {
      type: DataTypes.DATEONLY, 
      allowNull: false,
      defaultValue: Sequelize.NOW, 
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
    tableName: 'Gold_Rate',
  },
);

// Define associations
User.hasMany(Rate, { foreignKey: 'createdBy' });
Rate.belongsTo(User, { foreignKey: 'createdBy' });

User.hasMany(Rate, { foreignKey: 'updatedBy' });
Rate.belongsTo(User, { foreignKey: 'updatedBy' });

export default Rate;
