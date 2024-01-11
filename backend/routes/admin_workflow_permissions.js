const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const permissionController = require('../controllers/admin_workflow_permissions');

router.post(
    '/add/:id', permissionController.addPermissions
);

router.post(
    '/update/:id', permissionController.updatePermissions
);

router.get(
    '/:id', permissionController.getPermissions
)

module.exports = router;
