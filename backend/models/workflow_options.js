const db = require('../utils/database');

module.exports = class Options {
    constructor (id, workflow_step, workflow_selector, workflow_options) {
        this.id = id;
        this.workflow_step = workflow_step;
        this.workflow_selector = workflow_selector;
        this.workflow_options = workflow_options;
    }

    static addoptions (options) {
        return db.execute(
            'INSERT INTO workflow_options (workflow_step, workflow_selector, workflow_options) VALUES(?, ?, ?)',
            [options.step, options.selector, options.option]
        )
        .then(result => {
            // After inserting, get the ID of the last inserted row
            const lastInsertId = result[0].insertId;
            return lastInsertId;
        });
    }

    static selectAllOptionsBySelector(step, selector) {
        return db.execute(
            'SELECT * FROM workflow_options WHERE workflow_step = ? AND workflow_selector = ?',
            [step, selector]
        );
    }

    static selectCategoryById(id) {
        return db.execute(
            'SELECT * FROM workflow_options WHERE id = ?',
            [id]
        );
    }
}