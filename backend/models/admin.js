const db = require('../utils/database');

module.exports = class Admin {
    constructor (id, employeeId , department, username, password) {
        this.id = id;
        this.employeeId  = employeeId ;
        this.department = department;
        this.username = username;
        this.password = password;
    }

    static addAdmin(admin) {
        return db.execute(
            'INSERT INTO admin(employeeId, department, username, password) VALUES(?, ?, ?, ?)',
            [admin.employeeId , admin.department, admin.username, admin.password]
        )
        .then(result => {
            // After inserting, get the ID of the last inserted row
            const lastInsertId = result[0].insertId;
            return lastInsertId;
        });
    }

    static getAdminById(id) {
        return db.execute(
            'SELECT * FROM admin a INNER JOIN employee e ON a.employeeId = e.id WHERE a.id = ?',
            [id]
        );
    }

    static getAdminByusername(username) {
        return db.execute(
            'SELECT * FROM admin WHERE username = ?',
            [username]
        );
    }

    static checkUsernameExceptAdmin(username, adminId) {
        return db.execute(
            'SELECT * FROM admin WHERE username = ? AND NOT id = ?',
            [username, adminId]
        );
    }

    static getAdminByEmployeeId(employeeId) {
        return db.execute(
            'SELECT a.id as admin_id, e.id as id, e.fname, e.mname, e.lname, e.position, a.department, a.status FROM admin a INNER  JOIN employee e ON a.employeeId = e.id WHERE e.emp_id = ?',
            [employeeId]
        );
    }

    static getAllAdmins(status, admin_id) {
        return db.execute(
            'SELECT a.id as adminId, e.emp_id as id, e.fname, e.mname, e.lname, e.position, a.department FROM admin a INNER JOIN employee e ON a.employeeId = e.id WHERE a.status = ? AND NOT a.id = ? AND NOT a.id = 1 ORDER BY e.id ASC',
            [status, admin_id]
        );
    }

    static searchAdmin(searchKey, status, admin_id) {
        return db.execute(
            'SELECT a.id as adminId, e.emp_id as id, e.fname, e.mname, e.lname, e.position, a.department FROM admin a INNER JOIN employee e ON a.employeeId = e.id WHERE (e.id LIKE ? OR e.fname LIKE ? OR e.mname LIKE ? OR e.lname LIKE ? OR CONCAT(e.fname, " ", e.mname, " ", e.fname) LIKE ? OR position LIKE ? OR department LIKE ? OR username LIKE ?) AND (a.status = ?) AND NOT a.id = ? AND NOT a.id = 1 ORDER BY e.id ASC',
            [searchKey, searchKey, searchKey, searchKey, searchKey, searchKey, searchKey, searchKey, status, admin_id]
        );
    }

    static updateAdminProfile(department, username, adminId) {
        return db.execute(
            'UPDATE admin SET department = ?, username = ? WHERE id = ?',
            [department, username, adminId]
        );
    }

    static updateAdminPosDep(department, position, empployeeId) {
        return db.execute(
            'UPDATE admin a INNER JOIN employee e ON a.employeeId = e.id SET a.department = ?, e.position = ? WHERE a.employeeId = ?',
            [department, position, empployeeId]
        );
    }

    static updateStatus(status, employeeId) {
        return db.execute(
            'UPDATE admin SET status = ? WHERE employeeId = ?',
            [status, employeeId]
        );
    }

    static changePassword(password, adminId) {
        return db.execute(
            'UPDATE admin SET password = ? WHERE id = ?',
            [password, adminId]
        );
    }
}