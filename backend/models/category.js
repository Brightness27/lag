const db = require('../utils/database');

module.exports = class Category {
    constructor (id, name) {
        this.id = id;
        this.name = name;
    }

    static addcategory (name) {
        return db.execute(
            'INSERT INTO inventory_category(name) VALUES(?)',
            [name]
        )
        .then(result => {
            // After inserting, get the ID of the last inserted row
            const lastInsertId = result[0].insertId;
            return lastInsertId;
        });
    }

    static selectAllCategory() {
        return db.execute(
            'SELECT * FROM inventory_category'
        );
    }

    static selectCategoryByName(name) {
        return db.execute(
            'SELECT * FROM inventory_category WHERE name = ?',
            [name]
        );
    }

    static selectCategoryById(id) {
        return db.execute(
            'SELECT * FROM inventory_category WHERE id = ?',
            [id]
        );
    }
}