const { validationResult } = require('express-validator');

const Admin = require('../models/admin');
const Permissions = require('../models/admin_workflow_permissions');

exports.addPermissions = async (req, res, next) => {

    const admin_id = req.params.id;
    const client_details = req.body.client_details;
    const pre_survey = req.body.pre_survey;
    const documents = req.body.documents;
    const payment = req.body.payment;
    const job_order = req.body.job_order;
    const load_side = req.body.load_side;
    const final_process = req.body.final_process;

    try {
        const permissions = {
            client_details: client_details,
            pre_survey: pre_survey,
            documents: documents,
            payment: payment,
            job_order: job_order,
            load_side: load_side,
            final_process: final_process
        };

        const addPermission = await Permissions.addPermission(permissions, admin_id);

        return res.json(addPermission)
        
    } catch (error) {
        return res.json({
            error: true,
            message: error.message
        })
    }

}

exports.getPermissions = async (req, res, next) => {

    const admin_id = req.params.id;
    try {

        const [permissions] = await Permissions.getPermissionByAdminId(admin_id);

        return res.json(permissions[0])
        
    } catch (error) {
        return res.json({
            error: true,
            message: error.message
        })
    }

}

exports.updatePermissions = async (req, res, next) => {

    const admin_id = req.params.id;
    const client_details = req.body.client_details;
    const pre_survey = req.body.pre_survey;
    const documents = req.body.documents;
    const payment = req.body.payment;
    const job_order = req.body.job_order;
    const load_side = req.body.load_side;
    const final_process = req.body.final_process;

    try {
        const permissions = {
            client_details: client_details,
            pre_survey: pre_survey,
            documents: documents,
            payment: payment,
            job_order: job_order,
            load_side: load_side,
            final_process: final_process
        };

        const updatePermission = await Permissions.updatePermission(permissions, admin_id);

        return res.json({
            error: false,
            message: "Permissions Updated"
        })
        
    } catch (error) {
        return res.json({
            error: true,
            message: error.message
        })
    }

}