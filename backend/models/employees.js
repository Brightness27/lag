const db = require('../utils/database');

module.exports = class Employee {
    constructor (id, fname, mname, lname, contact_number, email_address, address, tin, sss, philhealth, pagibig, emergency_contact_name, emergency_contact_number, beneficiary, position, status) {
        this.id = id;
        this.fname = fname;
        this.mname = mname;
        this.lname = lname;
        this.contact_number = contact_number;
        this.email_address = email_address;
        this.address = address;
        this.tin = tin;
        this.sss = sss;
        this.philhealth = philhealth;
        this.pagibig = pagibig;
        this.emergency_contact_name = emergency_contact_name;
        this.emergency_contact_number = emergency_contact_number;
        this.beneficiary = beneficiary;
        this.position = position;
        this.status = status;
    }

    static addEmployee(employee) {
        return db.execute(
            'INSERT INTO employee(id, fname, mname, lname, contact_number, email_address, address, tin, sss, philhealth, pagibig, emergency_contact_name, emergency_contact_number, beneficiary, position, sin_number, status) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [employee.id, employee.fname, employee.mname, employee.lname, employee.contact_number, employee.email_address, employee.address, employee.tin, employee.sss, employee.philhealth, employee.pagibig, employee.emergency_contact_name, employee.emergency_contact_number, employee.beneficiary, employee.position, employee.sin_number, employee.status]
        );
    }

    static updateEmployee(employee, id) {
        return db.execute(
            'UPDATE employee SET fname = ?, mname = ?, lname = ?, contact_number = ?, email_address = ?, address = ?, tin = ?, sss = ?, philhealth = ?, pagibig = ?, emergency_contact_name = ?, emergency_contact_number = ?, beneficiary = ?, position = ?, sin_number = ? WHERE id = ?',
            [employee.fname, employee.mname, employee.lname, employee.contact_number, employee.email_address, employee.address, employee.tin, employee.sss, employee.philhealth, employee.pagibig, employee.emergency_contact_name, employee.emergency_contact_number, employee.beneficiary, employee.position, employee.sin_number, id]
        );
    }

    static updateStatus(status, id) {
        return db.execute(
            'UPDATE employee SET status = ? WHERE id = ?',
            [status, id]
        );
    }

    static findEmployeeByEmail(email_address) {
        return db.execute(
            'SELECT * FROM employee WHERE email_address = ?',
            [email_address]
        );
    }

    static checkEmailExceptEmployee(email_address, id) {
        return db.execute(
            'SELECT * FROM employee WHERE email_address = ? AND NOT id = ?',
            [email_address, id]
        );
    }

    static findEmployeeById(id) {
        return db.execute(
            'SELECT * FROM employee WHERE id = ?',
            [id]
        );
    }

    static searchEmployees(searchKey, status) {
        return db.execute(
            'SELECT * FROM employee WHERE (id LIKE ? OR fname LIKE ? OR mname LIKE ? OR lname LIKE ? OR contact_number LIKE ? OR email_address LIKE ? OR position LIKE ?) AND status = ?',
            [searchKey, searchKey, searchKey, searchKey, searchKey, searchKey, searchKey, status]
        );
    }

    static getAllEmployees(status) {
        return db.execute(
            'SELECT * FROM employee WHERE status = ? ORDER BY id ASC',
            [status]
        );
    }

    static updateAdminProfile(details, employeeId) {
        return db.execute(
            'UPDATE employee SET fname = ?, mname = ?, lname = ?, contact_number = ?, email_address = ?, address = ?, emergency_contact_name = ?, emergency_contact_number = ?, beneficiary = ?, position = ? WHERE id = ?',
            [details.fname, details.mname, details.lname, details.contact_number, details.email_address, details.address, details.emergency_contact_name, details.emergency_contact_number, details.beneficiary, details.position, employeeId]
        );
    }


};