const { validationResult } = require('express-validator');

const fs = require('fs');
const path = require('path');

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
            date_received_long: new Date(date_received).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            date_received:  new_date_received,
            
        };

        const pre_survey = await Workflow.getPresurveyByWorkflowId(id);
        const documents = await Workflow.getDocumentsByWorkflowId(id);
        const payment = await Workflow.getPaymentByWorkflowId(id);
        const job_order = await Workflow.getJobOrderByWorkflowId(id);
        const load_side = await Workflow.getLoadsideByWorkflowId(id);
        const final_process = await Workflow.getfinalProcessByWorkflowId(id);

        const [files] = await Workflow.getFilesByWorkflowId(id);

        const formattedFiles = files.map(file => ({
            ... file,
            file_name: file.image_path.replace('assets/workflow_images/', '')
        }));

        const complete_workflow = {
            client_details: formattedWorkflow,
            pre_survey: pre_survey[0][0],
            documents: documents[0][0],
            payment: payment[0][0],
            job_order: job_order[0][0],
            load_side: load_side[0][0],
            final_processing: final_process[0][0],
            files: formattedFiles
        }
        
        return res.json(complete_workflow);

    } catch (error) {
        return res.json({
            error: true,
            message: error.message
        })
    }
}

exports.getSpecificImageById = async (req, res, next) => {

    const id = req.params.id;

    try {
        const files = await Workflow.getSpecificImageById(id);
        
        return res.json(files[0][0]);

    } catch (error) {
        return res.json({
            error: true,
            message: error.message
        })
    }
}

exports.deleteFile = async (req, res, next) => {
    const id = req.params.id;
    const image_path = req.body.path;
    const filePath = path.join(__dirname, '..', 'lag_website', image_path);
    console.log(filePath);
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            const deleteFile = await Workflow.deleteFile(id);

            return res.json({
                error: false,
                message: "File has been deleted."
            });
        }
        else {
            return res.json({
                error: true,
                message: "Deleting failed."
            });
        }

        

    } catch (error) {
        return res.json({
            error: true,
            message: error.message
        })
    }
}

exports.addWorkflow = async (req, res, next) => {


    let files = "";

    if(req.files){
        files = req.files;
    }

    //console.log(files);

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        const extractedErrors = [];
        errors.array().map(err => extractedErrors.push( err.msg ));
        return res.json({ messages: extractedErrors});
    }

    const name = req.body.name;
    const address = req.body.address;
    const contact_no = req.body.contact_no;
    const date_received = req.body.date_received;
    const facility = req.body.facility;
    const structural_classification = req.body.structural_classification;
    const service_data = req.body.service_data;
    const private_pole = req.body.private_pole;
    const number_of_units = req.body.number_of_units;
    const feasibility = req.body.feasibility;
    const plus_code = req.body.plus_code;
    const pre_survey_remarks = req.body.pre_survey_remarks;
    const complete_mark = req.body.complete_mark;
    const documents_remarks = req.body.documents_remarks;
    const payment_mark = req.body.payment_mark;
    const ar_or_number = req.body.ar_or_number;
    const payment_remarks = req.body.payment_remarks;
    const job_order_remarks = req.body.job_order_remarks;
    const load_side_mark = req.body.load_side_mark;
    const load_side_remarks = req.body.load_side_remarks;
    const coordinator = req.body.coordinator;

    const client_details = {
        name: name,
        address: address,
        contact_no: contact_no,
        date_received: date_received
    };

    const pre_survey = {
        facility: facility,
        structural_classification: structural_classification,
        service_data: service_data,
        private_pole: private_pole,
        number_of_units: number_of_units,
        feasibility: feasibility,
        plus_code: plus_code,
        remarks: pre_survey_remarks
    };

    const documents = {
        complete_mark: complete_mark,
        remarks: documents_remarks
    };

    const payment = {
        payment_mark: payment_mark,
        ar_or_number: ar_or_number,
        remarks: payment_remarks
    };

    const job_order = {
        remarks: job_order_remarks
    };
    
    const load_side ={
        load_side_mark: load_side_mark,
        remarks: load_side_remarks
    };

    const final_processing = {
        coordinator: coordinator
    };

    

    try {

        const workflow_id = await Workflow.saveClientDetails(client_details);

        const save_pre_survey = await Workflow.savePresurvey(workflow_id, pre_survey);

        const save_documents = await Workflow.saveDocuments(workflow_id, documents);

        const save_payments = await Workflow.savePayment(workflow_id, payment);

        const save_job_order = await Workflow.saveJobOrder(workflow_id, job_order);

        const save_load_side = await Workflow.saveLoadSide(workflow_id, load_side);

        const save_final_processing = await Workflow.saveFinalProcessing(workflow_id, final_processing);

        const filesArray = Object.values(files);

        for (const fileArray of filesArray) {

            for (const file of fileArray) {
                const workflow_process_step = file.fieldname;
                const path = file.path;
                const replace_path_name = path.replace('lag_website\\', '');
                const image_path = replace_path_name.replaceAll('\\', '/');
                
                try {
                    const save_image = await Workflow.saveWorkflowImages(workflow_id, workflow_process_step, image_path);
                } catch (error) {
                    return res.json({
                        error: true,
                        message: error.message
                    });
                }
            }
            
        }

        return res.json({
            error: false,
            message: "Work Flow has been added.",
            id: workflow_id
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

    let files = "";

    if(req.files){
        files = req.files;
    }

    //console.log(files);

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        const extractedErrors = [];
        errors.array().map(err => extractedErrors.push( err.msg ));
        return res.json({ messages: extractedErrors});
    }

    const workflow_id = req.body.clientdetails_id;
    const name = req.body.name;
    const address = req.body.address;
    const contact_no = req.body.contact_no;
    const date_received = req.body.date_received;
    const facility = req.body.facility;
    const structural_classification = req.body.structural_classification;
    const service_data = req.body.service_data;
    const private_pole = req.body.private_pole;
    const number_of_units = req.body.number_of_units;
    const feasibility = req.body.feasibility;
    const plus_code = req.body.plus_code;
    const pre_survey_remarks = req.body.pre_survey_remarks;
    const complete_mark = req.body.complete_mark;
    const documents_remarks = req.body.documents_remarks;
    const payment_mark = req.body.payment_mark;
    const ar_or_number = req.body.ar_or_number;
    const payment_remarks = req.body.payment_remarks;
    const job_order_remarks = req.body.job_order_remarks;
    const load_side_mark = req.body.load_side_mark;
    const load_side_remarks = req.body.load_side_remarks;
    const coordinator = req.body.coordinator;

    const client_details = {
        id: workflow_id,
        name: name,
        address: address,
        contact_no: contact_no,
        date_received: date_received
    };

    const pre_survey = {
        id: req.body.presurvey_id,
        facility: facility,
        structural_classification: structural_classification,
        service_data: service_data,
        private_pole: private_pole,
        number_of_units: number_of_units,
        feasibility: feasibility,
        plus_code: plus_code,
        remarks: pre_survey_remarks
    };

    const documents = {
        id: req.body.documents_id,
        complete_mark: complete_mark,
        remarks: documents_remarks
    };

    const payment = {
        id: req.body.payment_id,
        payment_mark: payment_mark,
        ar_or_number: ar_or_number,
        remarks: payment_remarks
    };

    const job_order = {
        id: req.body.joborder_id,
        remarks: job_order_remarks
    };
    
    const load_side ={
        id: req.body.loadside_id,
        load_side_mark: load_side_mark,
        remarks: load_side_remarks
    };

    const final_processing = {
        id: req.body.finalprocess_id,
        coordinator: coordinator
    };

    try {

        const update_client_details = await Workflow.updateClientDetails(client_details);

        const update_pre_survey = await Workflow.updatePresurvey(pre_survey);

        const update_documents = await Workflow.updateDocuments(documents);

        const update_payments = await Workflow.updatePayment(payment);

        const update_job_order = await Workflow.updateJobOrder(job_order);

        const update_load_side = await Workflow.updateLoadSide(load_side);

        const update_final_processing = await Workflow.updateFinalProcessing(final_processing);

        const filesArray = Object.values(files);

        for (const fileArray of filesArray) {

            for (const file of fileArray) {
                const workflow_process_step = file.fieldname;
                const path = file.path;
                const replace_path_name = path.replace('lag_website\\', '');
                const image_path = replace_path_name.replaceAll('\\', '/');
                
                try {
                    const save_image = await Workflow.saveWorkflowImages(workflow_id, workflow_process_step, image_path);
                } catch (error) {
                    return res.json({
                        error: true,
                        message: error.message
                    });
                }
            }
            
        }

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