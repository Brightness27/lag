const db = require('../utils/database');

module.exports = class Adminpermissions {
    constructor (id, admin_id , client_details, pre_survey, documents, payment, job_order, load_side, final_process) {
        this.id = id;
        this.admin_id  = admin_id ;
        this.client_details = client_details;
        this.pre_survey = pre_survey;
        this.documents = documents;
        this.payment = payment;
        this.job_order = job_order;
        this.load_side = load_side;
        this.final_process = final_process;
    }

    static addPermission(permissions, admin_id) {
        return db.execute(
            'INSERT INTO admin_workflow_permissions (admin_id , client_details, pre_survey, documents, payment, job_order, load_side, final_process) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [admin_id, permissions.client_details, permissions.pre_survey, permissions.documents, permissions.payment, permissions.job_order, permissions.load_side, permissions.final_process]
        );
    }

    static updatePermission(permissions, admin_id) {
        return db.execute(
            'UPDATE admin_workflow_permissions SET client_details = ?, pre_survey = ?, documents = ?, payment = ?, job_order = ?, load_side = ?, final_process = ? WHERE admin_id = ?',
            [permissions.client_details, permissions.pre_survey, permissions.documents, permissions.payment, permissions.job_order, permissions.load_side, permissions.final_process, admin_id]
        );
    }

    static getPermissionByAdminId(admin_id) {
        return db.execute(
            'SELECT * FROM admin_workflow_permissions WHERE admin_id = ?',
            [admin_id]
        );
    }
}