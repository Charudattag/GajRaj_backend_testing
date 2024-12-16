import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './user.js';

const Banner = sequelize.define(
  'banners',
  {
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    link: {
      type: DataTypes.STRING(255),
      allowNull: true,
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
    tableName: 'banners',
  },
);

User.hasMany(Banner, { foreignKey: 'createdBy' });
Banner.belongsTo(User, { foreignKey: 'createdBy' });
User.hasMany(Banner, { foreignKey: 'updatedBy' });
Banner.belongsTo(User, { foreignKey: 'updatedBy' });

export default Banner;
