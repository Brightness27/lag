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
    workflowController.addWorkflow
);

router.post(
    '/update/:id/:step',
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
    '/details/:ctrlno', workflowController.getWorkflowByCtrlno
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

router.get(
    '/options/:step/:selector', workflowController.getOptions
);

router.get(
    '/filter/date/:order/:specificdate', workflowController.filterWorkflowByDay
);

router.get(
    '/filter/month/:order/:date', workflowController.filterWorkflowByMonth
);

router.get(
    '/filter/range/:order/:start/:end', workflowController.filterWorkflowByRange
);

router.get(
    '/filter/site/:order/:site', workflowController.filterWorkflowBySite
);

router.get(
    '/locations/', workflowController.getAllLocations
);

module.exports = router;