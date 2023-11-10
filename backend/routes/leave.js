const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const leaveController = require('../controllers/leave');

router.post(
    '/add',
    [
        body('employeeId').trim().not().isEmpty().withMessage('invalid employeeId'),
        body('leave_type').trim().not().isEmpty().withMessage('invalid leave type'),
        body('reason').trim().not().isEmpty().withMessage('invalid reason'),
        body('from_date').trim().not().isEmpty().withMessage('invalid from date'),
        body('to_date').trim().not().isEmpty().withMessage('invalid to date'),
        body('modified_by').trim().not().isEmpty().withMessage('invalid modified by')
    ],
    leaveController.addLeave
);

router.get('/', leaveController.getAllLeaves);

router.get('/leave-details/:par', leaveController.getSpecificLeavebyEmployee);

router.get('/search/:searchKey', leaveController.searchLeave);

module.exports = router;