const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const employeeController = require('../controllers/employees');

router.post(
    '/add',
    [
        body('id').trim().not().isEmpty().withMessage('invalid id'),
        body('fname').trim().not().isEmpty().withMessage('invalid first name'),
        body('lname').trim().not().isEmpty().withMessage('invalid last name'),
        body('contact_number').trim().not().isEmpty().withMessage('invalid contact_number'),
        body('email_address').trim().not().isEmpty().withMessage('invalid email address'),
        body('address').trim().not().isEmpty().withMessage('invalid address'),
        body('tin').trim().not().isEmpty().withMessage('invalid tin'),
        body('sss').trim().not().isEmpty().withMessage('invalid sss'),
        body('philhealth').trim().not().isEmpty().withMessage('invalid philhealth'),
        body('pagibig').trim().not().isEmpty().withMessage('invalid pagibig'),
        body('emergency_contact_name').trim().not().isEmpty().withMessage('invalid emergency contact name'),
        body('emergency_contact_number').trim().not().isEmpty().withMessage('invalid emergency contact number'),
        body('beneficiary').trim().not().isEmpty().withMessage('invalid beneficiary'),
        body('position').trim().not().isEmpty().withMessage('invalid position'),
        body('sin_number').trim().not().isEmpty().withMessage('invalid sin number')
    ],
    employeeController.addEmployee
);

router.put(
    '/update/:id',
    [
        body('fname').trim().not().isEmpty().withMessage('invalid first name'),
        body('lname').trim().not().isEmpty().withMessage('invalid last name'),
        body('contact_number').trim().not().isEmpty().withMessage('invalid contact_number'),
        body('email_address').trim().not().isEmpty().withMessage('invalid email address'),
        body('address').trim().not().isEmpty().withMessage('invalid address'),
        body('tin').trim().not().isEmpty().withMessage('invalid tin'),
        body('sss').trim().not().isEmpty().withMessage('invalid sss'),
        body('philhealth').trim().not().isEmpty().withMessage('invalid philhealth'),
        body('pagibig').trim().not().isEmpty().withMessage('invalid pagibig'),
        body('emergency_contact_name').trim().not().isEmpty().withMessage('invalid emergency contact name'),
        body('emergency_contact_number').trim().not().isEmpty().withMessage('invalid emergency contact number'),
        body('beneficiary').trim().not().isEmpty().withMessage('invalid beneficiary'),
        body('position').trim().not().isEmpty().withMessage('invalid position'),
        body('sin_number').trim().not().isEmpty().withMessage('invalid sin number')
    ],
    employeeController.updateEmployee
);

router.post(
    '/changeStatus/:id',
    [
        body('status').trim().not().isEmpty().withMessage('invalid status')
    ],
    employeeController.updateEmployeeStatus
);

router.get('/status/:status', employeeController.getAllEmployees);

router.get(
    '/id/:id',
    employeeController.getEmployeeById
);

router.get(
    '/email/:email',
    employeeController.getEmployeeByEmail
);

router.get('/search/:searchKey/:status', employeeController.searchEmployees);

module.exports = router;