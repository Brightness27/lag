const { validationResult } = require('express-validator');

const Workflow = require('../models/workflow');

exports.getAllWorkflow = async (req, res, next) => {
    try {
        const [workflows] = await Workflow.getAllWorkflow();

        const formattedWorkflows = workflows.map(workflow => ({
            ... workflow,
            date_received:  new Date(workflow.date_received).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        }));

        return res.json(formattedWorkflows);

    } catch (error) {
        return res.json({
            error: true,
            message: error.message
        })
    }
}

exports.getWorkflowById = async (req, res, next) => {

    const id = req.params.id;

    try {

        const workflow = await Workflow.getWorkflowById(id);

        if(workflow[0].length !== 1) {
            return res.json({
                message: 'no workflow found'
            });
        }

        const date_received = new Date(workflow[0][0].date_received);

        const year = date_received.getFullYear();
        const month = (date_received.getMonth() + 1).toString().padStart(2, '0');
        const day = date_received.getDate().toString().padStart(2, '0');

        const new_date_received = `${year}-${month}-${day}`;

        const formattedWorkflow = {
            ... workflow[0][0],
            date_received:  new_date_received,
        };

        const pre_survey = await Workflow.getPresurveyByWorkflowId(id);
        const documents = await Workflow.getDocumentsByWorkflowId(id);
        const payment = await Workflow.getPaymentByWorkflowId(id);
        const job_order = await Workflow.getJobOrderByWorkflowId(id);
        const load_side = await Workflow.getLoadsideByWorkflowId(id);
        const final_process = await Workflow.getfinalProcessByWorkflowId(id);

        const complete_workflow = {
            client_details: formattedWorkflow,
            pre_survey: pre_survey[0][0],
            documents: documents[0][0],
            payment: payment[0][0],
            job_order: job_order[0][0],
            load_side: load_side[0][0],
            final_processing: final_process[0][0]
        }
        
        return res.json(complete_workflow);

    } catch (error) {
        return res.json({
            error: true,
            message: error.message
        })
    }
}

exports.addWorkflow = async (req, res, next) => {

    const client_details = req.body.client_details;
    const pre_survey = req.body.pre_survey;
    const documents = req.body.documents;
    const payment = req.body.payment;
    const job_order = req.body.job_order;
    const load_side = req.body.load_side;
    const final_processing = req.body.final_processing;

    try {

        const workflow_id = await Workflow.saveClientDetails(client_details);

        const save_pre_survey = await Workflow.savePresurvey(workflow_id, pre_survey);

        const save_documents = await Workflow.saveDocuments(workflow_id, documents);

        const save_payments = await Workflow.savePayment(workflow_id, payment);

        const save_job_order = await Workflow.saveJobOrder(workflow_id, job_order);

        const save_load_side = await Workflow.saveLoadSide(workflow_id, load_side);

        const save_final_processing = await Workflow.saveFinalProcessing(workflow_id, final_processing);

        return res.json({
            error: false,
            message: "Work Flow has been added."
        });
    } catch (error) {
        return res.json({
            error: true,
            message: error.message
        });
    }
}

exports.addStatusUpdate = async (req, res, next) => {

    const action_date = req.body.action_date;
    const actions_taken = req.body.actions_taken;
    const customers_feedback = req.body.customers_feedback;
    const action_taken_by = req.body.action_taken_by;

    const workflow_id = req.params.id;

    try {

        const update_details = {
            action_date: action_date,
            actions_taken: actions_taken,
            customers_feedback: customers_feedback,
            action_taken_by: action_taken_by
        }

        const update = Workflow.saveStatusUpdate(workflow_id, update_details);

        return res.json({
            error: false,
            message: "Work Flow Update has been added."
        });
    } catch (error) {
        return res.json({
            error: true,
            message: error.message
        });
    }
}

exports.getWorkflowStatusUpdates = async (req, res, next) => {
        
    const workflow_id = req.params.id;

    try {

        const workflow = await Workflow.getWorkflowById(workflow_id);

        const formattedWorkflow = {
            ...workflow[0][0],
            date_received: new Date(workflow[0][0].date_received).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        };

        const [status_updates] = await Workflow.getStatusUpdateByWorkflowId(workflow_id);

        const formattedUpdates = status_updates.map(update => ({
            ...update,
            action_date: new Date(update.action_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        }));

        
        const statusUpdates = {
            ... formattedWorkflow,
            status_updates: formattedUpdates
        };

        return res.json(statusUpdates);

    } catch (error) {
        return res.json({
            error: true,
            message: error.message
        })
    }
}

exports.updateWorkflow = async (req, res, next) => {

    const client_details = req.body.client_details;
    const pre_survey = req.body.pre_survey;
    const documents = req.body.documents;
    const payment = req.body.payment;
    const job_order = req.body.job_order;
    const load_side = req.body.load_side;
    const final_processing = req.body.final_processing;

    try {

        const update_client_details = await Workflow.updateClientDetails(client_details);

        const update_pre_survey = await Workflow.updatePresurvey(pre_survey);

        const update_documents = await Workflow.updateDocuments(documents);

        const update_payments = await Workflow.updatePayment(payment);

        const update_job_order = await Workflow.updateJobOrder(job_order);

        const update_load_side = await Workflow.updateLoadSide(load_side);

        const update_final_processing = await Workflow.updateFinalProcessing(final_processing);

        return res.json({
            error: false,
            message: "Work Flow has been updated."
        });
    } catch (error) {
        return res.json({
            error: true,
            message: error.message
        });
    }
}

exports.searchWorkflow = async (req, res, next) => {

    const sKey = req.params.searchKey;

    try {

        const searchKey = `%${sKey}%`;


        const [workflows] = await Workflow.searchWorkFlow(searchKey);

        const formattedWorkflows = workflows.map(workflow => ({
            ... workflow,
            date_received:  new Date(workflow.date_received).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        }));

        return res.json(formattedWorkflows);

    } catch (error) {
        res.json({
            error: true,
            message: error.message
        })
    }
}