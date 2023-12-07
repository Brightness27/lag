const express = require('express');
const { body } = require('express-validator');
const multer = require('multer');
const router = express.Router();

const workflowController = require('../controllers/workflow');

router.post(
    '/add', workflowController.addWorkflow
);

router.post(
    '/update', workflowController.updateWorkflow
);

router.post(
    '/status/add/:id', workflowController.addStatusUpdate
);

router.get(
    '/', workflowController.getAllWorkflow
);

router.get(
    '/details/:id', workflowController.getWorkflowById
);

router.get(
    '/status-updates/:id', workflowController.getWorkflowStatusUpdates
);

router.get(
    '/search/:searchKey', workflowController.searchWorkflow
);

module.exports = router;