const express = require('express');
const path = require('path')
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const cors = require('cors');

const employeeRoutes = require('./routes/employees');
const adminRoutes = require('./routes/admin');
const leaveRoutes = require('./routes/leave');
const inventoryRoutes = require('./routes/inventory');
const workflowRoutes = require('./routes/workflow');
const permissionRoutes = require('./routes/admin_workflow_permissions');

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
app.use('/inventory', inventoryRoutes);
app.use('/workflow', workflowRoutes);
app.use('/permissions', permissionRoutes);
  
app.use(express.static(path.join(__dirname, 'lag_website')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'lag_website/index.html'));
});

app.listen(ports, '192.168.68.106', () => {
    console.log(`listening to port ${ports}`);
});

// const express = require('express');
// const bodyParser = require('body-parser');
// const mysql = require('mysql2');
// const path = require('path');

// const cors = require('cors');

// const employeeRoutes = require('./routes/employees');
// const adminRoutes = require('./routes/admin');
// const leaveRoutes = require('./routes/leave');
// const inventoryRoutes = require('./routes/inventory');
// const workflowRoutes = require('./routes/workflow');

// const app = express();

// const ports = process.env.PORT || 3000;

// app.use(cors());
// app.use(bodyParser.json());

// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     next();
// });

// app.use(express.static(path.join(__dirname, 'files')));

// app.use('/employees', employeeRoutes);
// app.use('/admin', adminRoutes);
// app.use('/leave', leaveRoutes);
// app.use('/inventory', inventoryRoutes);
// app.use('/workflow', workflowRoutes);
  
// app.listen(3000, () => {
//     console.log(`listening to port ${ports}`);
// });