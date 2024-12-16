const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js'); 

const Invoice = sequelize.define('Invoice', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  invoice_pdf: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'URL to the invoice PDF',
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'invoices',
  timestamps: true, // Disable automatic `createdAt` and `updatedAt` fields
});

module.exports = Invoice;
