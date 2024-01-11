const db = require('../utils/database');

module.exports = class DevLocation {
    constructor (id, location, code) {
        this.id = id;
        this.location = location;
        this.code = code;
    }

    static getAllLocation() {
        return db.execute(
            'SELECT * FROM developer_locations'
        );
    }

    static getLocationById(id) {
        return db.execute(
            'SELECT * FROM developer_locations WHERE id = ?',
            [id]
        );
    }

    static getLocationByCode(code) {
        return db.execute(
            'SELECT * FROM developer_locations WHERE code = ?',
            [code]
        );
    }

    static getLocationByLocation(location) {
        return db.execute(
            'SELECT * FROM developer_locations WHERE location = ?',
            [location]
        );
    }

    static addlocation(location, code) {
        return db.execute(
            'INSERT INTO developer_locations (location, code) VALUES (?, ?)',
            [location, code]
        );
    }
}