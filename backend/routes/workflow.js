const express = require('express');
const { body } = require('express-validator');

const multer = require('multer');

const DIR = 'lag_website/assets/workflow_images';

const router = express.Router();

const workflowController = require('../controllers/workflow');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        console.log("File: " + file);
        cb(null, Date.now() + '-' + file.originalname);
    }
});

var upload = multer({storage: storage});

router.post(
    '/add',
    upload.fields([{name: 'pre_survey', maxCount: 20}, {name: 'documents', maxCount: 20}, {name: 'job_order', maxCount: 20}, {name: 'load_side', maxCount: 20}]),
    workflowController.addWorkflow
);

router.post(
    '/update',
    upload.fields([{name: 'pre_survey', maxCount: 20}, {name: 'documents', maxCount: 20}, {name: 'job_order', maxCount: 20}, {name: 'load_side', maxCount: 20}]),
    workflowController.updateWorkflow
);

router.post(
    '/status/add/:id', workflowController.addStatusUpdate
);

router.post(
    '/deleteFile/:id', workflowController.deleteFile
);

router.get(
    '/', workflowController.getAllWorkflow
);

router.get(
    '/details/:id', workflowController.getWorkflowById
);

router.get(
    '/details/image/:id', workflowController.getSpecificImageById
);

router.get(
    '/status-updates/:id', workflowController.getWorkflowStatusUpdates
);

router.get(
    '/search/:searchKey', workflowController.searchWorkflow
);

module.exports = router;