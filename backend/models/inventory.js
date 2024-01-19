const db = require('../utils/database');

module.exports = class Inventory {
    constructor (id, item_code, name, category, quantity, unit, last_purchase_date, last_stock_date, status) {
        this.id = id;
        this.item_code = item_code;
        this.name = name;
        this.category  = category ;
        this.quantity = quantity;
        this.unit = unit;
        this.last_purchase_date = last_purchase_date;
        this.last_stock_date = last_stock_date;
        this.status = status;
    }

    static addInventory(inventory) {
        return db.execute(
            'INSERT INTO inventory(name, category, unit, size, last_purchase_date, last_stock_date, status) VALUES(?, ?, ?, ?, ?, ?, ?)',
            [inventory.name, inventory.category, inventory.unit, inventory.size, inventory.last_purchase_date, inventory.last_stock_date, inventory.status]
        )
        .then(result => {
            // After inserting, get the ID of the last inserted row
            const lastInsertId = result[0].insertId;
            return lastInsertId;
        });
    }

    static getItemByName(name) {
        return db.execute(
            'SELECT * FROM inventory WHERE name = ?',
            [name]
        );
    }

    static getItemByNameExcept(name, id) {
        return db.execute(
            'SELECT * FROM inventory WHERE name = ? AND NOT item_code = ?',
            [name, id]
        );
    }

    static updateItemCode(item_code, id) {
        return db.execute(
            'UPDATE inventory SET item_code = ? WHERE id = ?',
            [item_code, id]
        )
    }

    static getAllInventories() {
        return db.execute(
            "SELECT i.item_code AS item_code, i.size AS size, i.name AS name, i.unit AS unit, c.name AS category_name, i.last_purchase_date AS last_purchase_date, i.last_stock_date AS last_stock_date, (SUM(CASE WHEN p.process_type = 'IN' THEN p.quantity ELSE 0 END) - SUM(CASE WHEN p.process_type = 'OUT' THEN p.quantity ELSE 0 END)) AS quantity FROM inventory i INNER JOIN inventory_category c ON i.category = c.id LEFT JOIN inventory_processes p ON i.item_code = p.item_code GROUP BY i.item_code, i.size, i.name, c.name, i.last_purchase_date, i.last_stock_date ORDER BY i.category ASC, i.item_code ASC"
        )
    }

    static getItemByCode(item_code) {
        return db.execute(
            "SELECT i.item_code AS item_code, i.size AS size, i.name AS name, i.unit AS unit, c.name AS category_name, (COALESCE(SUM(CASE WHEN p.process_type = 'IN' THEN p.quantity ELSE 0 END), 0) - COALESCE(SUM(CASE WHEN p.process_type = 'OUT' THEN p.quantity ELSE 0 END), 0)) AS quantity, i.last_purchase_date AS last_purchase_date, i.last_stock_date AS last_stock_date FROM inventory i INNER JOIN inventory_category c ON i.category = c.id LEFT JOIN inventory_processes p ON i.item_code = p.item_code WHERE i.item_code = ? GROUP BY i.item_code, i.size, i.name, c.name, i.last_purchase_date, i.last_stock_date",
            [item_code]
        )
    }

    static searchInventories(searchKey) {
        return db.execute(
            "SELECT i.item_code AS item_code, i.size AS size, i.name AS name, i.unit AS unit, c.name AS category_name, (SUM(CASE WHEN p.process_type = 'IN' THEN p.quantity ELSE 0 END) - SUM(CASE WHEN p.process_type = 'OUT' THEN p.quantity ELSE 0 END)) AS quantity , i.last_purchase_date AS last_purchase_date, i.last_stock_date AS last_stock_date FROM inventory i INNER JOIN inventory_category c ON i.category = c.id LEFT JOIN inventory_processes p ON i.item_code = p.item_code WHERE i.item_code LIKE ? OR i.name LIKE ? OR c.name LIKE ? OR i.last_purchase_date LIKE ?  OR i.last_stock_date LIKE ? GROUP BY i.item_code, i.size, i.name, c.name, i.last_purchase_date, i.last_stock_date ORDER BY i.category ASC, i.item_code ASC",
            [searchKey, searchKey, searchKey, searchKey, searchKey, searchKey]
        )
    }

    static updateItem(item_details, item_code) {
        return db.execute(
            'UPDATE inventory SET name = ?, category = ?, size = ? WHERE item_code = ?',
            [item_details.name, item_details.category, item_details.size, item_code]
        )
    }

    static updateStocks(stock, item_code) {
        return db.execute(
            'UPDATE inventory SET quantity = ? WHERE item_code = ?',
            [stock, item_code]
        )
    }

    static updateStockDate(stock, last_purchase_date, item_code) {
        return db.execute(
            'UPDATE inventory SET last_stock_date = ?, last_purchase_date = ? WHERE item_code = ?',
            [stock, last_purchase_date, item_code]
        )
    }

    static countProcess(item, process) {
        return db.execute(
            'SELECT SUM(quantity) as total FROM inventory_processes WHERE item_code = ? AND process_type = ?',
            [item, process]
        );
    }

    static getHistory(date) {
        return db.execute(
            "SELECT i.item_code, i.name, i.size, COALESCE(SUM(CASE WHEN ip.process_type = 'IN' AND ip.process_date = ? THEN ip.quantity ELSE 0 END), 0) AS total_in, COALESCE(SUM(CASE WHEN ip.process_type = 'OUT' AND ip.process_date = ? THEN ip.quantity ELSE 0 END), 0) AS total_out, COALESCE(SUM(CASE WHEN ip.process_type = 'IN' AND ip.process_date <= ? THEN ip.quantity ELSE 0 END), 0) - COALESCE(SUM(CASE WHEN ip.process_type = 'OUT' AND ip.process_date <= ? THEN ip.quantity ELSE 0 END), 0) AS remaining_quantity, i.unit FROM inventory i LEFT JOIN inventory_processes ip ON i.item_code = ip.item_code WHERE ip.process_date <= ? GROUP BY i.item_code, i.name, i.size, i.unit ORDER BY i.item_code",
            [date, date, date, date, date]
        );
    }

}