const { validationResult } = require('express-validator');
const Employee = require('../models/employees');

exports.addEmployee = async (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);

        return res.json({
            error: true,
            message: errorMessages
        });
    }

    const id = req.body.id;
    const fname = req.body.fname;
    const mname = req.body.mname;
    const lname = req.body.lname;
    const contact_number = req.body.contact_number;
    const email_address = req.body.email_address;
    const address = req.body.address;
    const tin = req.body.tin;
    const sss = req.body.sss;
    const philhealth = req.body.philhealth;
    const pagibig = req.body.pagibig;
    const emergency_contact_name = req.body.emergency_contact_name;
    const emergency_contact_number = req.body.emergency_contact_number;
    const beneficiary = req.body.beneficiary;
    const position = req.body.position;
    const sin_number = req.body.sin_number;
    const status = 'Active';

    try {
        const employeeDetails = {
            id: id,
            fname: fname,
            mname: mname,
            lname: lname,
            contact_number: contact_number,
            email_address: email_address,
            address: address,
            tin: tin,
            sss: sss,
            philhealth: philhealth,
            pagibig: pagibig,
            emergency_contact_name: emergency_contact_name,
            emergency_contact_number: emergency_contact_number,
            beneficiary: beneficiary,
            position: position,
            sin_number: sin_number,
            status: status
        }

        const idExist = await Employee.findEmployeeById(id);

        if(idExist[0].length > 0) {
            return res.json({
                error: true,
                message: "id already in use."
            });
        }

        if(email_address.toUpperCase() !== 'N/A') {
            const emailExist = await Employee.findEmployeeByEmail(email_address);

            if(emailExist[0].length > 0) {
                return res.json({
                    error: true,
                    message: 'Email already in use.'
                });
            }
        }
        
        const result = await Employee.addEmployee(employeeDetails);

        return res.json({
            error: false,
            message: 'Employee has been added.'
        });

    } catch (error) {
        res.json({
            error: true,
            message: error.message
        })
    }
}

exports.updateEmployee = async (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);

        return res.json({
            error: true,
            message: errorMessages
        });
    }

    const id = req.params.id;

    const emp_id = req.body.emp_id;
    const fname = req.body.fname;
    const mname = req.body.mname;
    const lname = req.body.lname;
    const contact_number = req.body.contact_number;
    const email_address = req.body.email_address;
    const address = req.body.address;
    const tin = req.body.tin;
    const sss = req.body.sss;
    const philhealth = req.body.philhealth;
    const pagibig = req.body.pagibig;
    const emergency_contact_name = req.body.emergency_contact_name;
    const emergency_contact_number = req.body.emergency_contact_number;
    const beneficiary = req.body.beneficiary;
    const position = req.body.position;
    const sin_number = req.body.sin_number;

    try {
        const employeeDetails = {
            emp_id: emp_id,
            fname: fname,
            mname: mname,
            lname: lname,
            contact_number: contact_number,
            email_address: email_address,
            address: address,
            tin: tin,
            sss: sss,
            philhealth: philhealth,
            pagibig: pagibig,
            emergency_contact_name: emergency_contact_name,
            emergency_contact_number: emergency_contact_number,
            beneficiary: beneficiary,
            position: position,
            sin_number: sin_number
        }

        const emailExist = await Employee.checkEmailExceptEmployee(email_address, id);

        if(emailExist[0].length > 0) {
            return res.json({
                error: true,
                message: 'Email already in use.'
            });
        }

        const result = await Employee.updateEmployee(employeeDetails, id);

        res.json({
            error: false,
            message: 'Employee has been updated.'
        })

    } catch (error) {
        res.json({
            error: true,
            message: error.message
        })
    }
}

exports.resignEmployee = async (req, res, next) => {

    const id = req.params.id;
    const status = 'Resigned';

    try {
        const result = await Employee.updateStatus(status, id);

        res.json({
            error: false,
            message: 'Employee has been marked as resigned.'
        })

    } catch (error) {
        res.json({
            error: true,
            message: error.message
        })
    }
}

exports.updateEmployeeStatus = async (req, res, next) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);

        return res.json({
            error: true,
            message: errorMessages
        });
    }

    const employeeId = req.params.id;

    const status = req.body.status;

    try {

        const result = await Employee.updateStatus(status, employeeId);

        const message = 'Employee has been marked as ' + status + '.';
        return res.json({
            error: false,
            message: message
        });

    } catch (error) {
        return res.json({
            error: true,
            message: error.message
        });
    }
}

exports.getAllEmployees = async (req, res, next) => {

    const status = req.params.status;

    try {

        const [employees] = await Employee.getAllEmployees(status);

        return res.json(employees);

    } catch (error) {
        res.json({
            error: true,
            message: error.message
        })
    }
}

exports.getEmployeeById = async (req, res, next) => {

    const id = req.params.id;
    try {

        const employee = await Employee.findEmployeeById(id);

        if(employee[0].length !== 1) {
            return res.json({
                message: 'no employee found'
            });
        }

        return res.json(employee[0][0]);

       

    } catch (error) {
        res.json({
            error: true,
            message: error.message
        })
    }
}

exports.getEmployeeByEmail = async (req, res, next) => {

    const email = req.params.email;

    try {

        const employee = await Employee.findEmployeeByEmail(email);

        if(employee[0].length !== 1) {
            return res.json({
                message: 'no employee found'
            });
        }

        return res.json(employee[0][0]);

    } catch (error) {
        res.json({
            error: true,
            message: error.message
        })
    }
}

exports.searchEmployees = async (req, res, next) => {

    const searchKey = `%${req.params.searchKey}%`;

    const status = req.params.status;

    try {

        const [employees] = await Employee.searchEmployees(searchKey, status);

        return res.json(employees);

    } catch (error) {
        res.json({
            error: true,
            message: error.message
        })
    }
}