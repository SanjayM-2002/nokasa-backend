const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  fullname: String,
  phone: String,
  address: {
    latitude: String,
    longitude: String,
  },
  deliveryTime: String,
});

const Order = mongoose.model('Order', orderSchema);
module.exports = { Order };
