const db = require('../utils/database');

module.exports = class InventoryProcesses {
    constructor (id, item_code, process_count, process_date , process_type, details) {
        this.id = id;
        this.item_code = item_code;
        this.process_count = process_count;
        this.process_date  = process_date ;
        this.process_type = process_type;
        this.details = details;
    }

    static updateProcess(processDetails) {
        return db.execute(
            'INSERT INTO inventory_processes(item_code, quantity, process_date, process_type, details) VALUES (?, ?, ?, ?, ?)',
            [processDetails.item_code, processDetails.quantity, processDetails.process_date, processDetails.process_type, processDetails.details]
        )
    }
}