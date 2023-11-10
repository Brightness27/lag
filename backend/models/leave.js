const db = require('../utils/database');

module.exports = class Leave {
    constructor (id, employeeId, leave_type, reason, from_date, to_date, modified_by, date_modified) {
        this.id = id;
        this.employeeId = employeeId;
        this.leave_type = leave_type;
        this.reason = reason;
        this.from_date = from_date;
        this.to_date = to_date;
        this.modified_by = modified_by;
        this.date_modified = date_modified;
    }

    static addLeave (leaveDetails) {
        return db.execute(
            'INSERT INTO leavetbl(employeeId, leave_type, reason, from_date, to_date, modified_by, date_modified) VALUES(?, ?, ?, ?, ?, ?, ?)',
            [leaveDetails.employeeId, leaveDetails.leave_type, leaveDetails.reason, leaveDetails.from_date, leaveDetails.to_date, leaveDetails.modified_by, leaveDetails.date_modified]
        );
    }

    static getAllLeaves() {
        return db.execute(
            'SELECT e.id AS employeeId, e.fname AS fname, e.mname AS mname, e.lname AS lname, COUNT(CASE WHEN l.leave_type = "Sick Leave" THEN 1 END) AS SickLeaveCount, COUNT(CASE WHEN l.leave_type = "Vacation Leave" THEN 1 END) AS VacationLeaveCount, COUNT(CASE WHEN l.leave_type = "Emergency Leave" THEN 1 END) AS EmergencyLeaveCount From leavetbl l Inner JOIN employee e ON l.employeeId = e.id GROUP BY e.id'
        );
    }

    static getSpecificLeaveOfemployee(leaveType, employeeId) {
        return db.execute(
            'SELECT l.from_date, l.to_date, l.reason, CONCAT(e.fname, " ", e.mname, " ", e.lname) AS modified_by, l.date_modified FROM leavetbl l INNER JOIN admin a ON l.modified_by = a.id INNER JOIN employee e ON a.employeeId = e.id where l.employeeId = ? AND leave_type = ?',
            [employeeId, leaveType]
        );
    }

    static searchLeave(searchKey) {
        return db.execute(
            'SELECT e.id AS employeeId, e.fname AS fname, e.mname AS mname, e.lname AS lname, COUNT(CASE WHEN l.leave_type = "Sick Leave" THEN 1 END) AS SickLeaveCount, COUNT(CASE WHEN l.leave_type = "Vacation Leave" THEN 1 END) AS VacationLeaveCount, COUNT(CASE WHEN l.leave_type = "Emergency Leave" THEN 1 END) AS EmergencyLeaveCount From leavetbl l Inner JOIN employee e ON l.employeeId = e.id WHERE e.fname LIKE ? OR e.mname LIKE ? OR e.lname LIKE ? GROUP BY e.id',
            [searchKey, searchKey, searchKey]
        );
    }
}