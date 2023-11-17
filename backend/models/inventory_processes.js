const db = require('../utils/database');

module.exports = class InventoryProcesses {
    constructor (id, item_code, name, category , stock, last_stock_date, status) {
        this.id = id;
        this.item_code = item_code;
        this.name = name;
        this.category  = category ;
        this.stock = stock;
        this.last_stock_date = last_stock_date;
        this.status = status;
    }

    static updateProcess(processDetails) {
        return db.execute(
            'INSERT INTO inventory_processes(item_code, process_count, count_date, process_type, details) VALUES (?, ?, ?, ?, ?)',
            [processDetails.item_code, processDetails.process_count, processDetails.count_date, processDetails.process_type, processDetails.details]
        )
    }
}