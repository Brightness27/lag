const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const inventoryController = require('../controllers/inventory');

router.post(
    '/add',
    [
        body('name').trim().not().isEmpty().withMessage('invalid name'),
        body('category').trim().not().isEmpty().withMessage('invalid category'),
        body('stock').trim().not().isEmpty().withMessage('invalid stock')
    ],
    inventoryController.addInventory
);

router.get(
    '/all-categories',
    inventoryController.getCategories
);

router.get(
    '/all-inventories',
    inventoryController.getInventories
);

router.get(
    '/details/:code',
    inventoryController.getItemByCode
);

router.get(
    '/search/:searchKey',
    inventoryController.searchInventories
);

router.post(
    '/process/:type/:id',
    [
        body('stockCount').trim().not().isEmpty().withMessage('invalid stock count'),
        body('details').trim().not().isEmpty().withMessage('invalid details')
    ],
    inventoryController.processInventories
);

module.exports = router;