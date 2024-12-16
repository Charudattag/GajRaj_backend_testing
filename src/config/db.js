/* eslint-disable no-undef */

import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false,
  },
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Automatically alter the tables to match model definitions
    await sequelize.sync({ alter: true });
    console.log('Database tables synced successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

export default sequelize;
