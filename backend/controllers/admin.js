const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Admin = require('../models/admin');
const Employee = require('../models/employees');

exports.addAdmin = async (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.json(errors);
    }

    const employeeId = req.body.employeeId;
    const department = req.body.department;
    const username = req.body.username;
    const pass = req.body.password;

    try {

        const alreadyAdmin = await Admin.getAdminByEmployeeId(employeeId);

        if(alreadyAdmin[0].length !== 0) {
            return res.json({
                error: true,
                message: 'employee is already an admin.'
            });
        }

        const existingAdmin = await Admin.getAdminByusername(username);

        if(existingAdmin[0].length !== 0) {
            return res.json({
                error: true,
                message: 'username already in use.'
            });
        }

        const password = await bcrypt.hash(pass, 12);

        const adminDetails = {
            employeeId: employeeId,
            department: department,
            username: username,
            password: password
        }

        const result = await Admin.addAdmin(adminDetails);

        return res.json({
            error: false,
            message: 'Admin has been added.'
        });

    } catch (error) {
        return res.json({
            error: true,
            message: error.message
        })
    }
}

exports.login = async (req, res, next) => {

    const username = req.body.username;
    const pass = req.body.password;

    try {

        const user = await Admin.getAdminByusername(username);

        if (user[0].length !== 1) {
            return res.json({
                error: true,
                message: 'invalid username.',
                token: "no token",
                adminId: 0,
                department: "no department"
            })
        }

        const storeduser = user[0][0];

        const token = jwt.sign(
            {
                adminUsername: storeduser.username,
                adminId: storeduser.id

            },
            'secretfortoken',
            { expiresIn: '48h'}
        );

        const isEqual = await bcrypt.compare(pass, storeduser.password);

        if(!isEqual) {
            return res.json({
                error: true,
                message: 'invalid password.',
                token: "no token",
                adminId: 0,
                department: "no department"
            })
        }

        const employeeId = storeduser.employeeId;
        
        const employeeDetails = await Employee.findEmployeeById(employeeId);

        if(employeeDetails[0][0].status !== 'Active') {
            return res.json({
                error: true,
                message: 'Admin has already resigned.',
                token: "no token",
                adminId: 0,
                department: "no department"
            });
        }

        return res.json({
            error: false,
            message: 'credentials correct.',
            token: token,
            adminId: storeduser.id,
            department: storeduser.department
        });

    } catch (error) {
        return res.json({
            error: true,
            message: error.message,
            token: "no token",
            adminId: 0,
            department: "no department"
        })
    }
}

exports.getAdminById = async (req, res, next) => {
    const adminId = req.params.id;

    try {
        const admin = await Admin.getAdminById(adminId);

        if(admin[0].length !== 1) {
            return res.json({
                error: true,
                message: 'no admin found'
            });
        }

        return res.json(admin[0][0]);
    } catch (error) {
        return res.json({
            error: true,
            message: error.message
        })
    }
}

exports.getAdminByEmployeeId = async (req, res, next) => {
    const employeeId = req.params.id;

    try {
        const admin = await Admin.getAdminByEmployeeId(employeeId);

        if(admin[0].length !== 1) {
            return res.json({
                error: true,
                message: 'no admin found'
            });
        }

        return res.json(admin[0][0]);
    } catch (error) {
        return res.json({
            error: true,
            message: error.message
        })
    }
}

exports.getAllAdmins = async (req, res, next) => {

    const status = req.params.status;

    try {

        const [Admins] = await Admin.getAllAdmins(status);

        return res.json(Admins);

    } catch (error) {
        return res.json({
            error: true,
            message: error.message
        })
    }
}

exports.searchAdmins = async (req, res, next) => {

    const searchKey = `%${req.params.searchKey}%`;

    const status = req.params.status;

    try {

        const [admins] = await Admin.searchAdmin(searchKey, status);

        return res.json(admins);

    } catch (error) {
        return res.json({
            error: true,
            message: error.message
        });
    }
}

exports.updateAdminProfile = async (req, res, next) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.json(errors);
    }

    const adminId = req.params.id;

    const department = req.body.department;
    const username = req.body.username;

    const employeeId = req.body.employeeId;
    const fname = req.body.fname;
    const mname = req.body.mname;
    const lname = req.body.lname;
    const contact_number = req.body.contact_number;
    const email_address = req.body.email_address;
    const address = req.body.address;
    const emergency_contact_name = req.body.emergency_contact_name;
    const emergency_contact_number = req.body.emergency_contact_number;
    const beneficiary = req.body.beneficiary;
    const position = req.body.position;

    try {

        const adminProfileDetails = {
            fname: fname,
            mname: mname,
            lname: lname,
            contact_number: contact_number,
            email_address: email_address,
            address: address,
            emergency_contact_name: emergency_contact_name,
            emergency_contact_number: emergency_contact_number,
            beneficiary: beneficiary,
            position: position
        }

        const updateAdmin = await Admin.updateAdminProfile(department, username, adminId);

        const updateAdminProfileDetails = await Employee.updateAdminProfile(adminProfileDetails, employeeId);

        return res.json({
            error: false,
            message: 'Admin profile has been updated.'
        });

    } catch (error) {
        return res.json({
            error: true,
            message: error.message
        });
    }
}

exports.updateAdminPosDep = async (req, res, next) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.json(errors);
    }

    const employeeId = req.params.id;

    const department = req.body.department;
    const position = req.body.position;

    try {

        const updateAdmin = await Admin.updateAdminPosDep(department, position, employeeId);


        return res.json({
            error: false,
            message: 'Admin has been updated.'
        });

    } catch (error) {
        return res.json({
            error: true,
            message: error.message
        });
    }
}

exports.changePassword = async (req, res, next) => {

    const adminId = req.params.id;

    const old_password = req.body.old_password;
    const new_password = req.body.new_password;

    try {
        const admin = await Admin.getAdminById(adminId);
        const storedAdmin = admin[0][0];

        const isEqual = await bcrypt.compare(old_password, storedAdmin.password);

        if(!isEqual) {
            return res.json({
                error: true,
                message: 'incorrect old password.'
            });
        }

        const password = await bcrypt.hash(new_password, 12);

        const changePass = await Admin.changePassword(password, adminId);

        return res.json({
            error: false,
            message: 'Password changed Successfully.'
        });

    } catch (error) {
        return res.json({
            error: true,
            message: error.message
        });
    }
}

exports.updateAdminStatus = async (req, res, next) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.json(errors);
    }

    const employeeId = req.params.id;

    const status = req.body.status;

    try {

        const updateAdmin = await Admin.updateStatus(status, employeeId);

        const result = await Employee.updateStatus(status, employeeId);

        const message = 'Admin has been marked as ' + status + '.';
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