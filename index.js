const express = require('express');
const path = require('path');
var cors =require('cors');
const connection = require('./connection');
const app = express();


// Import Routes
const userRoute = require('./routes/products');
const orderRoute = require('./routes/orders');
const productRoute = require('./routes/user');


// Use Routes
app.use('/api/products',userRoute);
app.use('/api/users',productRoute);
app.use('/api/orders',orderRoute);



app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());




module.exports = app;