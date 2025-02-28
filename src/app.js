const express = require('express');
const orderRoutes = require('./routes/orderRoutes')
const metricsRoutes = require('./routes/metricsRoutes');  
const app = express();
const port = 3000;
require('dotenv').config();

app.use(express.json());
app.use(orderRoutes);      
app.use(metricsRoutes);   

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
