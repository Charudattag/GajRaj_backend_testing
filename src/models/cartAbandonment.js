const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js'); 
const Customer = require('../models/customer.js')

const CartAbandonment = sequelize.define('CartAbandonment', {
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Customer,
      key: 'id',
    },
  },
  products: {
    type: DataTypes.TEXT,
    allowNull: false,
    references:{
      model: Product,
      key: 'id',
    }
  },
  total_price: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  }
}, {
  tableName: 'cart_abandonment',
  timestamps: true, 
});

CartAbandonment.belongsTo(Customer, { foreignKey: 'customer_id' });

CartAbandonment.belongsTo(Product, { foreignKey: 'products', through: 'product_id' });

module.exports = CartAbandonment;
