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

    static getLeaveCount(leaveType, employeeId) {
        return db.execute(
            'SELECT COALESCE(SUM(TIMESTAMPDIFF(DAY, from_date, to_date) + 1), 0) AS leave_count FROM leavetbl WHERE leave_type = ? AND employeeId = ?',
            [leaveType, employeeId]
        );
    }

    static getMaxLeaveAllowed(leaveType) {
        return db.execute(
            'SELECT num_days_allowed FROM leave_type WHERE id = ?',
            [leaveType]
        );
    }

    static getAllLeaves() {
        return db.execute(
            'SELECT e.id AS employeeId, e.fname AS fname, e.mname AS mname, e.lname AS lname, COALESCE(SUM(CASE WHEN l.leave_type = 1 THEN TIMESTAMPDIFF(DAY, from_date, to_date) + 1  END ), 0) AS SickLeaveCount, COALESCE(SUM(CASE WHEN l.leave_type = 2 THEN TIMESTAMPDIFF(DAY, from_date, to_date) + 1 END ), 0) AS VacationLeaveCount, COALESCE(SUM(CASE WHEN l.leave_type = 3 THEN TIMESTAMPDIFF(DAY, from_date, to_date) + 1 END ), 0) AS EmergencyLeaveCount From employee e LEFT JOIN leavetbl l ON l.employeeId = e.id LEFT JOIN leave_type t ON l.leave_type = t.id GROUP BY e.id;'
        );
    }

    static getAllLeaveTypes() {
        return db.execute(
            'SELECT * FROM leave_type'
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
            'SELECT e.id AS employeeId, e.fname AS fname, e.mname AS mname, e.lname AS lname, COALESCE(SUM(CASE WHEN l.leave_type = 1 THEN TIMESTAMPDIFF(DAY, from_date, to_date) + 1  END ), 0) AS SickLeaveCount, COALESCE(SUM(CASE WHEN l.leave_type = 2 THEN TIMESTAMPDIFF(DAY, from_date, to_date) + 1 END ), 0) AS VacationLeaveCount, COALESCE(SUM(CASE WHEN l.leave_type = 3 THEN TIMESTAMPDIFF(DAY, from_date, to_date) + 1 END ), 0) AS EmergencyLeaveCount From employee e LEFT JOIN leavetbl l ON l.employeeId = e.id LEFT JOIN leave_type t ON l.leave_type = t.id WHERE CONCAT(e.fname, " ", e.mname, " ", e.lname) LIKE ? GROUP BY e.id',
            [searchKey]
        );
    }
}