const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const adminController = require('../controllers/admin');

router.post(
    '/add',
    [
        body('employeeId').trim().not().isEmpty().withMessage('invalid employeeId'),
        body('department').trim().not().isEmpty().withMessage('invalid department'),
        body('username').trim().not().isEmpty().withMessage('invalid username'),
        body('password').trim().not().isEmpty().withMessage('invalid password')
    ],
    adminController.addAdmin
);

router.post(
    '/login',
    adminController.login
);

router.post(
    '/change-password/:id',
    [
        body('old_password').trim().not().isEmpty().withMessage('invalid old_password'),
        body('new_password').trim().not().isEmpty().withMessage('invalid new_password')
    ],
    adminController.changePassword
);

router.post(
    '/update/:id',
    [
        body('department').trim().not().isEmpty().withMessage('invalid department'),
        body('username').trim().not().isEmpty().withMessage('invalid username'),
        body('employeeId').trim().not().isEmpty().withMessage('invalid employeeId'),
        body('fname').trim().not().isEmpty().withMessage('invalid fname'),
        body('lname').trim().not().isEmpty().withMessage('invalid lname'),
        body('contact_number').trim().not().isEmpty().withMessage('invalid contact_number'),
        body('email_address').trim().not().isEmpty().withMessage('invalid email_address'),
        body('address').trim().not().isEmpty().withMessage('invalid address'),
        body('emergency_contact_name').trim().not().isEmpty().withMessage('invalid emergency_contact_name'),
        body('emergency_contact_number').trim().not().isEmpty().withMessage('invalid emergency_contact_number'),
        body('beneficiary').trim().not().isEmpty().withMessage('invalid beneficiary'),
        body('position').trim().not().isEmpty().withMessage('invalid position')
    ],
    adminController.updateAdminProfile
);

router.post(
    '/updateposdep/:id',
    [
        body('department').trim().not().isEmpty().withMessage('invalid department'),
        body('position').trim().not().isEmpty().withMessage('invalid position')
    ],
    adminController.updateAdminPosDep
);

router.post(
    '/changeStatus/:id',
    [
        body('status').trim().not().isEmpty().withMessage('invalid status')
    ],
    adminController.updateAdminStatus
);

router.get(
    '/id/:id',
    adminController.getAdminById
)

router.get(
    '/employeeid/:id',
    adminController.getAdminByEmployeeId
)

router.get('/status/:status', adminController.getAllAdmins);

router.get(
    '/search/:searchKey/:status',
    adminController.searchAdmins
);

module.exports = router;