const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { z } = require('zod');
const cors = require('cors');
const connectDb = require('./db/connectDB');
const { Order } = require('./models/orderModel');
dotenv.config();
const app = express();
connectDb();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const orderSchema = z.object({
  fullname: z.string().min(1, { message: 'Fullname is required' }),
  phone: z.string().min(1, { message: 'Phone number is required' }),
  latitude: z
    .string()
    .regex(/^-?\d+(\.\d+)?$/, { message: 'Latitude must be a valid number' }),
  longitude: z
    .string()
    .regex(/^-?\d+(\.\d+)?$/, { message: 'Longitude must be a valid number' }),
  deliveryTime: z.string().min(1, { message: 'Delivery time is required' }),
});

app.get('/hello', (req, res) => {
  res.json({ msg: 'hello' });
});
app.post('/orders', async (req, res) => {
  try {
    const inputData = req.body;
    const zodResponse = orderSchema.safeParse(inputData);

    if (!zodResponse.success) {
      res.status(401).json({ error: zodResponse.error });
      return;
    }
    const dataResponse = zodResponse.data;
    const newOrder = new Order({
      fullname: dataResponse.fullname,
      phone: dataResponse.phone,
      address: {
        latitude: dataResponse.latitude,
        longitude: dataResponse.longitude,
      },
      deliveryTime: dataResponse.deliveryTime,
    });
    await newOrder.save();
    res
      .status(201)
      .json({ message: 'Order saved successfully', orderDetail: newOrder });
  } catch (error) {
    console.log('Error in signup user ', error);
    return res.status(500).json({ error });
  }
});
app.listen(PORT, () => {
  console.log(`express app listening on port ${PORT}`);
});
