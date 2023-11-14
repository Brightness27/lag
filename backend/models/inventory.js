const db = require('../utils/database');

module.exports = class Inventory {
    constructor (id, item_code, name, category , stock, last_stock_date, status) {
        this.id = id;
        this.item_code = item_code;
        this.name = name;
        this.category  = category ;
        this.stock = stock;
        this.last_stock_date = last_stock_date;
        this.status = status;
    }

    static addInventory (inventory) {
        return db.execute(
            'INSERT INTO inventory(name, category, stock, last_stock_date, status) VALUES(?, ?, ?, ?, ?)',
            [inventory.name, inventory.category, inventory.stock, inventory.last_stock_date, inventory.status]
        )
        .then(result => {
            // After inserting, get the ID of the last inserted row
            const lastInsertId = result[0].insertId;
            return lastInsertId;
        });
    }

    static updateItemCode(item_code, id) {
        return db.execute(
            'UPDATE inventory SET item_code = ? WHERE id = ?',
            [item_code, id]
        )
    }

    static getAllInventories() {
        return db.execute(
            'SELECT i.item_code AS item_code, i.name AS name, c.name AS category_name, i.stock AS stock, i.last_stock_date AS last_stock_date FROM inventory i INNER JOIN inventory_category c ON i.category = c.id ORDER BY i.category ASC, i.item_code ASC'
        )
    }

    static getItemByCode(item_code) {
        return db.execute(
            'SELECT i.item_code AS item_code, i.name AS name, c.name AS category_name, i.stock AS stock, i.last_stock_date AS last_stock_date FROM inventory i INNER JOIN inventory_category c ON i.category = c.id WHERE i.item_code = ?',
            [item_code]
        )
    }


}