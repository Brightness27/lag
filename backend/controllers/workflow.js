const { validationResult } = require('express-validator');

const fs = require('fs');
const path = require('path');

const Workflow = require('../models/workflow');
const Options = require('../models/workflow_options');
const Devlocation = require('../models/developer_location');

exports.getAllWorkflow = async (req, res, next) => {
    try {
        const [workflows] = await Workflow.getAllWorkflow();

        const formattedWorkflows = workflows.map(workflow => ({
            ... workflow,
            date_received:  new Date(workflow.date_received).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase(),
        }));

        return res.json(formattedWorkflows);

    } catch (error) {
        return res.json({
            error: true,
            message: error.message
        })
    }
}

exports.getWorkflowByCtrlno = async (req, res, next) => {

    const ctrlno = req.params.ctrlno;

    try {

        const workflow = await Workflow.getWorkflowByCtrlno(ctrlno);

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
            date_received_long: (new Date(date_received).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })).toUpperCase(),
            date_received:  new_date_received,
            
        };

        const id = formattedWorkflow.id;

        const pre_survey_details = await Workflow.getPresurveyByWorkflowId(id);
        const documents_details = await Workflow.getDocumentsByWorkflowId(id);
        const payment_details = await Workflow.getPaymentByWorkflowId(id);
        const job_order_details = await Workflow.getJobOrderByWorkflowId(id);
        const load_side_details = await Workflow.getLoadsideByWorkflowId(id);
        const final_process_details = await Workflow.getfinalProcessByWorkflowId(id);

        let pre_survey = {};
        let documents = {};
        let payment = {};
        let job_order = {};
        let load_side = {};
        let final_process = {};

        if(pre_survey_details[0].length > 0) {
            pre_survey = pre_survey_details[0][0];
        }
        else {
            pre_survey = {
                id: '',
                work_flow_id: '',
                facility: '',
                structural_classification: '',
                service_data: '',
                private_pole: '',
                number_of_units: '',
                feasibility: '',
                plus_code: '',
                remarks: ''
            }
        }

        if(documents_details[0].length > 0) {
            documents = documents_details[0][0];
        }
        else {
            documents = {
                id: '',
                work_flow_id: '',
                complete_mark: '',
                remarks: ''
            }
        }

        if(payment_details[0].length > 0) {
            payment = payment_details[0][0];
        }
        else {
            payment = {
                id: '',
                work_flow_id: '',
                package_price: 0,
                payment_mark: '',
                amount: 0,
                down_payment: 0,
                balance: 0,
                ar_or_number: '',
                remarks: ''
            }
        }

        if(job_order_details[0].length > 0) {
            job_order = job_order_details[0][0];
        }
        else {
            job_order = {
                id: '',
                work_flow_id: '',
                remarks: ''
            }
        }

        if(load_side_details[0].length > 0) {
            load_side = load_side_details[0][0];
        }
        else {
            load_side = {
                id: '',
                work_flow_id: '',
                load_side_mark: '',
                remarks: ''
            }
        }

        if(final_process_details[0].length > 0) {
            final_process = final_process_details[0][0];
        }
        else {
            final_process = {
                id: '',
                work_flow_id: '',
                coordinator: '',
                cbm_no: '',
                case_no: '',
                sin_no: '',
                tracker_status: '',
                reason: ''
            }
        }


        const [files] = await Workflow.getFilesByWorkflowId(id);

        const formattedFiles = files.map(file => ({
            ... file,
            file_name: file.image_path.replace('assets/workflow_images/', '')
        }));

        const complete_workflow = {
            client_details: formattedWorkflow,
            pre_survey: pre_survey,
            documents: documents,
            payment: payment,
            job_order: job_order,
            load_side: load_side,
            final_processing: final_process,
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

exports.getAllLocations = async (req, res, next) => {
    try {
        const [locations] = await Devlocation.getAllLocation();

        return res.json(locations);

    } catch (error) {
        return res.json({
            error: true,
            message: error.message
        })
    }
}

exports.addWorkflow = async (req, res, next) => {

    const fname = req.body.fname;
    const mname = req.body.mname;
    const lname = req.body.lname;
    const address = req.body.address;
    const contact_no = req.body.contact_no;
    const date_received = req.body.date_received;
    const category = req.body.category;
    let developer_location = req.body.developer_location;
    const initial_communicator = req.body.initial_communicator;

    try {

        let location_code = '';

        if(category === 'WALK-IN') {
            location_code = 'WLK';
            developer_location = 'OFFICE';
        }

        else {
            if(developer_location === 'OTHER') {
                const new_location = req.body.new_location;

                let initial = '';

                const location_splitted = Array.from(new_location);

                for (let i = 0; i < new_location.length; i++) {
                    initial += location_splitted[i];
    
                    const getLocation = await Devlocation.getLocationByCode(initial);

                    if(getLocation[0].length < 1) {
                        const addLocation = await Devlocation.addlocation(new_location, initial);
                        location_code = initial;
                        break;
                    }
                }
            }
            else {
                const location = await Devlocation.getLocationByLocation(developer_location);

                location_code = location[0][0].code;
            }
        }

        const dr = new Date(date_received);
        const year = dr.getFullYear();
        const month = dr.getMonth();

        let month_shortcut = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'NOV', 'DEC'];

        const getMonth = month_shortcut[month];

        const initial_code = `${location_code}-${getMonth}${year}`;

        const client_details = {
            ctrl_no: initial_code, 
            fname: fname,
            mname: mname,
            lname: lname,
            address: address,
            contact_no: contact_no,
            date_received: date_received,
            category: category,
            location: developer_location,
            initial_communicator: initial_communicator
        };

        const workflow_id = await Workflow.saveClientDetails(client_details);

        const search = `${initial_code}%`;

        const workflowCount = await Workflow.countByCode(search);

        const getCount = workflowCount[0][0].count;

        const ctrl_no = `${location_code}-${getMonth}${year}-${getCount}`;

        const save_ctrl_no = await Workflow.updateCtrlNo(ctrl_no, workflow_id);

        return res.json({
            error: false,
            message: "Work Flow has been added.",
            ctrlno: ctrl_no
        });
    } catch (error) {
        return res.json({
            error: true,
            message: error.message
        });
    }
}

exports.addStatusUpdate = async (req, res, next) => {

    const status_id = req.body.id;

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

exports.updateStatusUpdate = async (req, res, next) => {

    const status_id = req.body.id;

    const action_date = req.body.action_date;
    const actions_taken = req.body.actions_taken;
    const customers_feedback = req.body.customers_feedback;
    const action_taken_by = req.body.action_taken_by;

    try {
        const update_details = {
            id: status_id,
            action_date: action_date,
            actions_taken: actions_taken,
            customers_feedback: customers_feedback,
            action_taken_by: action_taken_by
        }

        const update = await Workflow.updateStatusUpdate(update_details);

        return res.json({
            error: false,
            message: "Work Flow Update has been updated."
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
            action_date_long: new Date(update.action_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            action_date: new Date(update.action_date + 'Z').toISOString().split('T')[0]
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

    const step = req.params.step;
    const workflow_id = req.params.id;

    let details = {};

    if(step === 'client_details') {
        details = {
            id: workflow_id,
            fname: req.body.fname,
            mname: req.body.mname,
            lname: req.body.lname,
            address: req.body.address,
            contact_no: req.body.contact_no,
            date_received: req.body.date_received,
            initial_communicator: req.body.initial_communicator
        };
    }

    else if(step === 'pre_survey') {
        let structural_classification = req.body.structural_classification;

        if(structural_classification === 'OTHERS') {
            structural_classification = req.body.other_structural_classification;

            try {
                const options = {
                    step: 'pre_survey',
                    selector: 'structural_classification',
                    option: structural_classification
                }

                const addStructuralClassification = await Options.addoptions(options);

            } catch (error) {
                return res.json({
                    error: true,
                    message: error.message
                });
            }
        }

        let service_data = req.body.service_data;

        if(service_data === 'OTHERS') {
            service_data = req.body.other_service_data;

            try {
                const options = {
                    step: 'pre_survey',
                    selector: 'service_data',
                    option: service_data
                }

                const addServiceData = await Options.addoptions(options);

            } catch (error) {
                return res.json({
                    error: true,
                    message: error.message
                });
            }
        }

        details = {
            id: req.body.id,
            facility: req.body.facility,
            structural_classification: structural_classification,
            service_data: service_data,
            private_pole: req.body.private_pole,
            number_of_units: req.body.number_of_units,
            feasibility: req.body.feasibility,
            plus_code: req.body.plus_code,
            remarks: req.body.remarks
        };
    }

    else if(step === 'documents') {
        details = {
            id: req.body.id,
            complete_mark: req.body.complete_mark,
            remarks: req.body.remarks
        };
    }

    else if(step === 'payment') {
        details = {
            id: req.body.id,
            package_price: req.body.package_price,
            payment_mark: req.body.payment_mark,
            amount: req.body.amount,
            down_payment: req.body.down_payment,
            balance: req.body.balance,
            ar_or_number: req.body.ar_or_number,
            remarks: req.body.remarks
        };
    }

    else if(step === 'job_order') {
        details = {
            id: req.body.id,
            remarks: req.body.remarks
        };
    }

    else if(step === 'load_side') {
        const load_side = req.body.load_side_mark;

        if(load_side === 'others') {
            load_side = req.body.other_load_side;

            try {
                const options = {
                    step: 'load_side',
                    selector: 'load_side',
                    option: load_side
                }

                const addLoadSide = await Options.addoptions(options);

            } catch (error) {
                return res.json({
                    error: true,
                    message: error.message
                });
            }
        }

        details = {
            id: req.body.id,
            load_side_mark: load_side,
            remarks: req.body.remarks
        };
    }

    else if(step === 'final_process') {
        details = {
            id: req.body.id,
            coordinator: req.body.coordinator,
            cbm_no: req.body.cbm_no,
            case_no: req.body.case_no,
            sin_no: req.body.sin_no,
            tracker_status: req.body.tracker_status,
            date_energized: req.body.date_energized,
            reason: req.body.reason
        };
    }

    try {

        let message = '';

        switch (step) {
            case "client_details":
                const update_clientDetails = await Workflow.updateClientDetails(details);
                
                message =  "Client details has been updated.";
                break;

            case "pre_survey":
                const pre_survey_details = await Workflow.getPresurveyByWorkflowId(workflow_id);

                if(pre_survey_details[0].length > 0) {
                    const update_pre_survey = await Workflow.updatePresurvey(details);
                }
    
                else {
                    if(Object.keys(details).length !== 0) {
                        const insert_pre_survey = await Workflow.savePresurvey(workflow_id, details);
                    }
                }
    
                message = "Pre-survey has been updated."
                break;

            case "documents":
                const documents_details = await Workflow.getDocumentsByWorkflowId(workflow_id);

                if(documents_details[0].length > 0) {
                    const update_documents = await Workflow.updateDocuments(details);
                }

                else {
                    if(Object.keys(details).length !== 0) {
                        const insert_documents = await Workflow.saveDocuments(workflow_id, details);
                    }
                    
                }
                message = "Documents has been updated.";
                break;
            
            case "payment":
                const payment_details = await Workflow.getPaymentByWorkflowId(workflow_id);

                if(payment_details[0].length > 0) {
                    const update_payment = await Workflow.updatePayment(details);
                }

                else {
                    if(Object.keys(details).length !== 0) {
                        const insert_payment = await Workflow.savePayment(workflow_id, details);
                    }
                    
                }
                
                message = "Payment has been updated.";
                break;

            case "job_order":
                const job_order_details = await Workflow.getJobOrderByWorkflowId(workflow_id);

                if(job_order_details[0].length > 0) {
                    const update_job_order = await Workflow.updateJobOrder(details);
                }

                else {
                    if(Object.keys(details).length !== 0) {
                        const insert_job_order = await Workflow.saveJobOrder(workflow_id, details);
                    }
                    
                }
                
                message = "Job Order has been updated.";
                break;

            case "load_side":
                const load_side_details = await Workflow.getLoadsideByWorkflowId(workflow_id);

                if(load_side_details[0].length > 0) {
                    const update_load_side = await Workflow.updateLoadSide(details);
                }

                else {
                    if(Object.keys(details).length !== 0) {
                        const insert_load_side = await Workflow.saveLoadSide(workflow_id, details);
                    }
                    
                }
                
                message = "Load Side has been updated.";
                break;

            case "final_process":
                const final_process_details = await Workflow.getfinalProcessByWorkflowId(workflow_id);

                if(final_process_details[0].length > 0) {
                    const update_final_process = await Workflow.updateFinalProcessing(details);
                }

                else {
                    if(Object.keys(details).length !== 0) {
                        const insert_final_process = await Workflow.saveFinalProcessing(workflow_id, details);
                    }
                    
                }
                
                message = "Final Process has been updated.";
                break;

        }

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
            message: message
        });
    } catch (error) {
        return res.json({
            error: true,
            message: error.message
        });
    }
}

exports.updatePayment = async (req, res, next) => {
    const workflow_id = req.params.id;

    const package_price = req.body.package_price;
    const amount = req.body.amount;
    const ar_or_number = req.body.ar_or_number;
    const date_of_payment = req.body.date_of_payment;
    const remarks = req.body.remarks;

    try {
        
    
        const workflow_payment = await Workflow.getPaymentByWorkflowId(workflow_id);

        if(workflow_payment[0].length < 1) {
            const addPackagePrice = await Workflow.addPackagePrice(workflow_id, package_price);
        }
        else {
            const payment_history = await Workflow.getPaymentHistory(workflow_id);
        
            if(payment_history.length < 1 && package_price !== workflow_payment[0][0].package_price) {
                const package = await Workflow.updatePackage(package_price, workflow_id);
            }
        }
        
        const payment_details = {
            workflow_id: workflow_id,
            amount: amount,
            date_of_payment: date_of_payment,
            ar_or_number: ar_or_number,
            remarks: remarks
        }
        
        const add_payment = await Workflow.addPayment(payment_details);

        res.json({
            error: false,
            message: "Payment Added."
        });

    } catch (error) {
        res.json({
            error: true,
            message: error.message
        })
    }
}

exports.getPaymentHistory = async (req, res, next) => {
    const workflow_id = req.params.id;

    try {
        const [payment_history] = await Workflow.getPaymentHistory(workflow_id);
    
        const formattedHistory = payment_history.map(history => ({
            ...history,
            date_of_payment: new Date(history.date_of_payment).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        }));


        res.json(formattedHistory);

    } catch (error) {
        res.json({
            error: true,
            message: error.message
        })
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

exports.getOptions = async (req, res, next) => {

    const step = req.params.step;
    const selector = req.params.selector;

    try {

        const [options] = await Options.selectAllOptionsBySelector(step, selector);

        return res.json(options);

    } catch (error) {
        return res.json({
            error: true,
            message: error.message
        })
    }
}

exports.filterWorkflowByDay = async (req, res, next) => {
    const site = req.params.site;

    const date = req.params.specificdate;

    try {

        let [filteredWorkflow] = [];

        if(site === 'ALL') {
            [filteredWorkflow] = await Workflow.filterWorkflowByDay(date);
        }
        else {
            [filteredWorkflow] = await Workflow.filterWorkflowByDayAndSite(date, site);
        }

        const formattedWorkflows = filteredWorkflow.map(workflow => ({
            ... workflow,
            date_received:  new Date(workflow.date_received).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase(),
        }));

        return res.json(formattedWorkflows);
        
    } catch (error) {
        return res.json({
            error: true,
            message: error.message
        })
    }
}

exports.filterWorkflowByMonth = async (req, res, next) => {

    const site = req.params.site;

    const d = req.params.date
    const date = `${d}%`;

    try {

        let [filteredWorkflow] = [];

        if(site === 'ALL') {
            [filteredWorkflow] = await Workflow.filterWorkflowByMonth(date);
        }

        else {
            [filteredWorkflow] = await Workflow.filterWorkflowByMonthAndSite(date, site);
        }
        
        const formattedWorkflows = filteredWorkflow.map(workflow => ({
            ... workflow,
            date_received:  new Date(workflow.date_received).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase(),
        }));

        return res.json(formattedWorkflows);
        
    } catch (error) {
        return res.json({
            error: true,
            message: error.message
        })
    }
}

exports.filterWorkflowByRange = async (req, res, next) => {

    const site = req.params.site;

    const start_date = req.params.start;
    const end_date = req.params.end;

    try {

        let [filteredWorkflow] = [];

        if(site === 'ALL') {
            [filteredWorkflow] = await Workflow.filterWorkflowByRange(start_date, end_date);
        }

        else {
            [filteredWorkflow] = await Workflow.filterWorkflowByRangeAndSite(start_date, end_date, site);
        }

        const formattedWorkflows = filteredWorkflow.map(workflow => ({
            ... workflow,
            date_received:  new Date(workflow.date_received).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase(),
        }));

        return res.json(formattedWorkflows);
        
    } catch (error) {
        return res.json({
            error: true,
            message: error.message
        })
    }
}

exports.filterWorkflowBySite = async (req, res, next) => {

    const site = req.params.site

    try {

        const [filteredWorkflow] = await Workflow.filterWorkflowBySite(site);
        
        const formattedWorkflows = filteredWorkflow.map(workflow => ({
            ... workflow,
            date_received:  new Date(workflow.date_received).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase(),
        }));

        return res.json(formattedWorkflows);
        
    } catch (error) {
        return res.json({
            error: true,
            message: error.message
        })
    }
}