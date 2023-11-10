const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const cors = require('cors');

const employeeRoutes = require('./routes/employees');
const adminRoutes = require('./routes/admin');
const leaveRoutes = require('./routes/leave');

const app = express();

const ports = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/employees', employeeRoutes);
app.use('/admin', adminRoutes);
app.use('/leave', leaveRoutes);
  
app.listen(3000, () => {
    console.log(`listening to port ${ports}`);
});