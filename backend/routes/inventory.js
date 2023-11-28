const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const inventoryController = require('../controllers/inventory');

router.post(
    '/add',
    [
        body('name').trim().not().isEmpty().withMessage('invalid name'),
        body('category').trim().not().isEmpty().withMessage('invalid category'),
        body('quantity').trim().not().isEmpty().withMessage('invalid quantity'),
        body('unit').trim().not().isEmpty().withMessage('invalid unit'),
        body('last_purchase_date').trim().not().isEmpty().withMessage('invalid last purchase date')
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