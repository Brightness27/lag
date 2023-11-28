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
            'INSERT INTO inventory(name, category, quantity, unit, last_purchase_date, last_stock_date, status) VALUES(?, ?, ?, ?, ?, ?, ?)',
            [inventory.name, inventory.category, inventory.quantity, inventory.unit, inventory.last_purchase_date, inventory.last_stock_date, inventory.status]
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

    static updateItemCode(item_code, id) {
        return db.execute(
            'UPDATE inventory SET item_code = ? WHERE id = ?',
            [item_code, id]
        )
    }

    static getAllInventories() {
        return db.execute(
            'SELECT i.item_code AS item_code, i.name AS name, c.name AS category_name, i.quantity AS quantity, i.last_purchase_date AS last_purchase_date, i.last_stock_date AS last_stock_date FROM inventory i INNER JOIN inventory_category c ON i.category = c.id ORDER BY i.category ASC, i.item_code ASC'
        )
    }

    static getItemByCode(item_code) {
        return db.execute(
            'SELECT i.item_code AS item_code, i.name AS name, c.name AS category_name, i.quantity AS quantity, i.last_purchase_date AS last_purchase_date, i.last_stock_date AS last_stock_date FROM inventory i INNER JOIN inventory_category c ON i.category = c.id WHERE i.item_code = ?',
            [item_code]
        )
    }

    static searchInventories(searchKey) {
        return db.execute(
            'SELECT i.item_code AS item_code, i.name AS name, c.name AS category_name, i.quantity AS quantity, i.last_purchase_date AS last_purchase_date, i.last_stock_date AS last_stock_date FROM inventory i INNER JOIN inventory_category c ON i.category = c.id WHERE i.item_code LIKE ? OR i.name LIKE ? OR c.name LIKE ? OR i.quantity LIKE ? OR i.last_purchase_date LIKE ?  OR i.last_stock_date LIKE ? ORDER BY i.category ASC, i.item_code ASC',
            [searchKey, searchKey, searchKey, searchKey, searchKey, searchKey]
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

}