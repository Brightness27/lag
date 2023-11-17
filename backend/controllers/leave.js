const { validationResult } = require('express-validator');

const Leave = require('../models/leave');
const Employee = require('../models/employees');
const Admin = require('../models/admin');

exports.addLeave = async (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.json(errors);
    }

    const employeeId = req.body.employeeId;
    const leave_type = req.body.leave_type;
    const reason = req.body.reason;
    const from_date = req.body.from_date;
    const to_date = req.body.to_date;
    const modified_by = req.body.modified_by;
    const date_modified = new Date().toISOString().slice(0,10);

    try {

        const leaveDetails = {
            employeeId: employeeId,
            leave_type: leave_type,
            reason: reason,
            from_date: from_date,
            to_date: to_date,
            modified_by: modified_by,
            date_modified: date_modified
        }

        const result = await Leave.addLeave(leaveDetails);

        return res.json({
            error: false,
            message: 'Leave has been recorded.'
        });

    } catch (error) {
        return res.json({
            error: true,
            message: error.message
        })
    }
}

exports.getAllLeaves = async (req, res, next) => {

    try {

        const [leaves] = await Leave.getAllLeaves();

        return res.json(leaves);

    } catch (error) {
        return res.json({
            error: true,
            message: error.message
        })
    }
}

exports.getSpecificLeavebyEmployee = async (req, res, next) => {
        
    const employeeId = req.params.id;
    const leaveType = req.params.type;

    try {
        const leave_type = leaveType.replace("-", " ");

        const employee = await Employee.findEmployeeById(employeeId);

        const [leaves] = await Leave.getSpecificLeaveOfemployee(leave_type, employeeId);

        const formattedLeaves = leaves.map(leave => ({
            ...leave,
            from_date: new Date(leave.from_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            to_date: new Date(leave.to_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            date_modified: new Date(leave.date_modified).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        }));

        
        const leaveDetails = {
            name: employee[0][0].fname + " " + employee[0][0].mname + " " + employee[0][0].lname,
            leave_type: leave_type,
            position: employee[0][0].position,
            leaveDetails: formattedLeaves
        };

        return res.json(leaveDetails);

    } catch (error) {
        return res.json({
            error: true,
            message: error.message
        })
    }
}

exports.searchLeave = async (req, res, next) => {

    const sKey = req.params.searchKey;

    try {

        const searchKey = `%${sKey}%`;


        const [leave] = await Leave.searchLeave(searchKey);

        return res.json(leave);

    } catch (error) {
        res.json({
            error: 'true',
            message: error.message
        })
    }
}