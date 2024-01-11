const db = require('../utils/database');

module.exports = class Workflow {
    constructor (id, reference_code, client_name, client_address, client_contact_no, date_received) {
        this.id = id;
        this.reference_code = reference_code;
        this.client_name = client_name;
        this.client_address = client_address;
        this.client_contact_no = client_contact_no;
        this.date_received = date_received;
    }

    static getAllWorkflow() {
        return db.execute(
            'SELECT w.*, wf.tracker_status FROM work_flow w LEFT JOIN work_flow_final_process wf ON w.id = wf.work_flow_id ORDER BY w.date_received ASC'
        );
    }

    static getWorkflowById(id) {
        return db.execute(
            'SELECT * FROM work_flow WHERE id = ?',
            [id]
        );
    }

    static getWorkflowByCtrlno(ctrlno) {
        return db.execute(
            'SELECT * FROM work_flow WHERE ctrl_no = ?',
            [ctrlno]
        );
    }

    static getPresurveyByWorkflowId(id) {
        return db.execute(
            'SELECT * FROM work_flow_pre_survey WHERE work_flow_id = ?',
            [id]
        );
    }

    static getDocumentsByWorkflowId(id) {
        return db.execute(
            'SELECT * FROM work_flow_documents WHERE work_flow_id = ?',
            [id]
        );
    }

    static getPaymentByWorkflowId(id) {
        return db.execute(
            'SELECT * FROM work_flow_payment WHERE work_flow_id = ?',
            [id]
        );
    }

    static getJobOrderByWorkflowId(id) {
        return db.execute(
            'SELECT * FROM work_flow_job_order WHERE work_flow_id = ?',
            [id]
        );
    }

    static getLoadsideByWorkflowId(id) {
        return db.execute(
            'SELECT * FROM work_flow_load_side WHERE work_flow_id = ?',
            [id]
        );
    }

    static getfinalProcessByWorkflowId(id) {
        return db.execute(
            'SELECT * FROM work_flow_final_process WHERE work_flow_id = ?',
            [id]
        );
    }

    static getFilesByWorkflowId(id) {
        return db.execute(
            'SELECT * FROM workflow_images WHERE workflow_id = ?',
            [id]
        );
    }

    static getSpecificImageById(id) {
        return db.execute(
            'SELECT * FROM workflow_images WHERE id = ?',
            [id]
        );
    }

    static getStatusUpdateByWorkflowId(id) {
        return db.execute(
            'SELECT * FROM work_flow_status_update WHERE work_flow_id = ?',
            [id]
        );
    }

    static saveClientDetails(client_details) {
        return db.execute(
            'INSERT INTO work_flow (ctrl_no, client_fname, client_mname, client_lname, client_address, client_contact_no, date_received, category, location, initial_communicator) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [client_details.ctrl_no, client_details.fname, client_details.mname, client_details.lname, client_details.address, client_details.contact_no, client_details.date_received, client_details.category, client_details.location, client_details.initial_communicator]
        )
        .then(result => {
            // After inserting, get the ID of the last inserted row
            const lastInsertId = result[0].insertId;
            return lastInsertId;
        });
    }

    static updateCtrlNo(ctrl_no, id) {
        return db.execute(
            'UPDATE work_flow SET ctrl_no = ? WHERE id = ?',
            [ctrl_no, id]
        );
    }

    static savePresurvey(workflow_id, pre_survey) {
        return db.execute(
            'INSERT INTO work_flow_pre_survey (work_flow_id, facility, structural_classification, service_data, private_pole, number_of_units, feasibility, plus_code, remarks) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [workflow_id, pre_survey.facility, pre_survey.structural_classification, pre_survey.service_data, pre_survey.private_pole, pre_survey.number_of_units, pre_survey.feasibility, pre_survey.plus_code, pre_survey.remarks]
        );
    }

    static saveDocuments(workflow_id, documents) {
        return db.execute(
            'INSERT INTO work_flow_documents (work_flow_id, complete_mark, remarks) VALUES(?, ?, ?)',
            [workflow_id, documents.complete_mark, documents.remarks]
        );
    }

    static savePayment(workflow_id, payments) {
        return db.execute(
            'INSERT INTO work_flow_payment (work_flow_id, payment_mark, amount, down_payment, balance, ar_or_number, remarks) VALUES(?, ?, ?, ?, ?, ?, ?)',
            [workflow_id, payments.payment_mark, payments.amount, payments.down_payment, payments.balance, payments.ar_or_number, payments.remarks]
        );
    }

    static saveJobOrder(workflow_id, job_order) {
        return db.execute(
            'INSERT INTO work_flow_job_order (work_flow_id, remarks) VALUES(?, ?)',
            [workflow_id, job_order.remarks]
        );
    }

    static saveLoadSide(workflow_id, load_side) {
        return db.execute(
            'INSERT INTO work_flow_load_side (work_flow_id, load_side_mark, remarks) VALUES(?, ?, ?)',
            [workflow_id, load_side.load_side_mark, load_side.remarks]
        );
    }

    static saveFinalProcessing(workflow_id, final_processing) {
        return db.execute(
            'INSERT INTO work_flow_final_process (work_flow_id, coordinator, cbm_no, case_no, sin_no, tracker_status, reason) VALUES(?, ?, ?, ?, ?, ?, ?)',
            [workflow_id, final_processing.coordinator, final_processing.cbm_no, final_processing.case_no, final_processing.sin_no, final_processing.tracker_status, final_processing.reason]
        );
    }

    static saveWorkflowImages(workflow_id, workflow_process_step, image_path) {
        return db.execute(
            'INSERT INTO workflow_images (workflow_id, workflow_process_step, image_path) VALUES(?, ?, ?)',
            [workflow_id, workflow_process_step, image_path]
        );
    }

    static saveStatusUpdate(workflow_id, status_update) {
        return db.execute(
            'INSERT INTO work_flow_status_update (work_flow_id, action_date, actions_taken, customers_feedback, action_taken_by) VALUES(?, ?, ?, ?, ?)',
            [workflow_id, status_update.action_date, status_update.actions_taken, status_update.customers_feedback, status_update.action_taken_by]
        );
    }

    static updateClientDetails(client_details) {
        return db.execute(
            'UPDATE work_flow SET client_fname = ?, client_mname = ?, client_lname = ?, client_address = ?, client_contact_no = ?, date_received = ?, initial_communicator = ? WHERE id = ?',
            [client_details.fname, client_details.mname, client_details.lname, client_details.address, client_details.contact_no, client_details.date_received, client_details.initial_communicator, client_details.id]
        );
    }

    static updatePresurvey(pre_survey) {
        return db.execute(
            'UPDATE work_flow_pre_survey SET facility = ?, structural_classification = ?, service_data = ?, private_pole = ?, number_of_units = ?, feasibility = ?, plus_code = ?, remarks = ? WHERE id = ?',
            [pre_survey.facility, pre_survey.structural_classification, pre_survey.service_data, pre_survey.private_pole, pre_survey.number_of_units, pre_survey.feasibility, pre_survey.plus_code, pre_survey.remarks, pre_survey.id]
        );
    }

    static updateDocuments(documents) {
        return db.execute(
            'UPDATE work_flow_documents SET complete_mark = ?, remarks = ? WHERE id = ?',
            [documents.complete_mark, documents.remarks, documents.id]
        );
    }

    static updatePayment(payments) {
        return db.execute(
            'UPDATE work_flow_payment SET payment_mark = ?, amount = ?, down_payment = ?, balance = ?, ar_or_number = ?, remarks = ? WHERE id = ?',
            [payments.payment_mark, payments.amount, payments.down_payment, payments.balance, payments.ar_or_number, payments.remarks, payments.id]
        );
    }

    static updateJobOrder(job_order) {
        return db.execute(
            'UPDATE work_flow_job_order SET remarks = ? WHERE id = ?',
            [job_order.remarks, job_order.id]
        );
    }

    static updateLoadSide(load_side) {
        return db.execute(
            'UPDATE work_flow_load_side SET load_side_mark = ?, remarks = ? WHERE id = ?',
            [load_side.load_side_mark, load_side.remarks, load_side.id]
        );
    }

    static updateFinalProcessing(final_processing) {
        return db.execute(
            'UPDATE work_flow_final_process SET coordinator = ?, cbm_no = ?, case_no = ?, sin_no = ?, tracker_status = ?, reason = ? WHERE id = ?',
            [final_processing.coordinator, final_processing.cbm_no, final_processing.case_no, final_processing.sin_no, final_processing.tracker_status, final_processing.reason, final_processing.id]
        );
    }

    static deleteFile(id){
        return db.execute(
            'DELETE FROM workflow_images WHERE id = ?',
            [id]
        );
    }

    static searchWorkFlow(searchKey){
        return db.execute(
            'SELECT w.*, wf.tracker_status FROM work_flow w LEFT JOIN work_flow_final_process wf ON w.id = wf.work_flow_id WHERE w.ctrl_no LIKE ? OR w.client_fname LIKE ? OR w.client_mname LIKE ? OR w.client_lname LIKE ? OR CONCAT(w.client_fname, " ", w.client_mname, " ", w.client_lname) LIKE ? OR w.client_address LIKE ? OR w.initial_communicator LIKE ? OR wf.tracker_status LIKE ? ORDER BY w.date_received ASC',
            [searchKey, searchKey, searchKey, searchKey, searchKey, searchKey, searchKey, searchKey]
        );
    }

    static countByCode(code) {
        return db.execute(
            'SELECT COUNT(*) AS count FROM work_flow WHERE ctrl_no LIKE ?',
            [code]
        );
    }

    static filterWorkflowByDayASC(date) {
        return db.execute(
            'SELECT w.*, wf.tracker_status FROM work_flow w LEFT JOIN work_flow_final_process wf ON w.id = wf.work_flow_id WHERE w.date_received = ? ORDER BY w.date_received ASC',
            [date]
        );
    }

    static filterWorkflowByMonthASC(date) {
        return db.execute(
            'SELECT w.*, wf.tracker_status FROM work_flow w LEFT JOIN work_flow_final_process wf ON w.id = wf.work_flow_id WHERE w.date_received LIKE ? ORDER BY w.date_received ASC',
            [date]
        );
    }

    static filterWorkflowByRangeASC(start_date, end_date) {
        return db.execute(
            'SELECT w.*, wf.tracker_status FROM work_flow w LEFT JOIN work_flow_final_process wf ON w.id = wf.work_flow_id WHERE w.date_received BETWEEN ? AND ?  ORDER BY w.date_received ASC',
            [start_date, end_date]
        );
    }

    static filterWorkflowBySiteASC(site) {
        return db.execute(
            'SELECT w.*, wf.tracker_status FROM work_flow w LEFT JOIN work_flow_final_process wf ON w.id = wf.work_flow_id WHERE w.location = ?  ORDER BY w.date_received ASC',
            [site]
        );
    }

    static filterWorkflowByDayDESC(date) {
        return db.execute(
            'SELECT w.*, wf.tracker_status FROM work_flow w LEFT JOIN work_flow_final_process wf ON w.id = wf.work_flow_id WHERE w.date_received = ? ORDER BY w.date_received DESC',
            [date]
        );
    }

    static filterWorkflowByMonthDESC(date) {
        return db.execute(
            'SELECT w.*, wf.tracker_status FROM work_flow w LEFT JOIN work_flow_final_process wf ON w.id = wf.work_flow_id WHERE w.date_received LIKE ? ORDER BY w.date_received DESC',
            [date]
        );
    }

    static filterWorkflowByRangeDESC(start_date, end_date) {
        return db.execute(
            'SELECT w.*, wf.tracker_status FROM work_flow w LEFT JOIN work_flow_final_process wf ON w.id = wf.work_flow_id WHERE w.date_received BETWEEN ? AND ?  ORDER BY w.date_received DESC',
            [start_date, end_date]
        );
    }

    static filterWorkflowBySiteDESC(site) {
        return db.execute(
            'SELECT w.*, wf.tracker_status FROM work_flow w LEFT JOIN work_flow_final_process wf ON w.id = wf.work_flow_id WHERE w.location = ?  ORDER BY w.date_received DESC',
            [site]
        );
    }
}