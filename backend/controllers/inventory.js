const { validationResult } = require('express-validator');

const Category = require('../models/category');
const Inventory = require('../models/inventory');

exports.addInventory = async (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.json(errors);
    }

    const name = req.body.name;
    const category  = req.body.category ;
    const stock = req.body.stock;

    const status = "On Stock";
    const last_stock_date = new Date().toISOString().slice(0,10);

    try {
        let categoryId = 0;

        const existingCategory = await Category.selectCategoryByName(category);

        if(existingCategory[0].length === 0) {
            categoryId = await Category.addcategory(category);
        }
        else {
            categoryId = existingCategory[0][0].id;
        }

        const inventoryDetails = {
            name: name,
            category: categoryId,
            stock: stock,
            last_stock_date: last_stock_date,
            status: status
        }

        const inventoryId = await Inventory.addInventory(inventoryDetails);

        const currentYear = last_stock_date.substring(0, 4);

        const paddedInventoryId = inventoryId.toString().padStart(4, "0");

        const paddedCategoryId = categoryId.toString().padStart(4, "0");

        const item_code = currentYear + paddedCategoryId + paddedInventoryId;

        const updateCode = await Inventory.updateItemCode(item_code, inventoryId);

        return res.json({
            error: false,
            message: 'Item Added'
        });

    } catch (error) {
        return res.json({
            error: true,
            message: error.message
        })
    }
}

exports.getCategories = async (req, res, next) => {
    
    try {

        const [categories] = await Category.selectAllCategory();


        return res.json(categories);

    } catch (error) {
        return res.json({
            error: true,
            message: error.message
        })
    }
}

exports.getInventories = async (req, res, next) => {
    
    try {

        const [inventories] = await Inventory.getAllInventories();

        const formattedInventories = inventories.map(inventory => ({
            ...inventory,
            last_stock_date: new Date(inventory.last_stock_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        }));
        
        return res.json(formattedInventories);

    } catch (error) {
        return res.json({
            error: true,
            message: error.message
        })
    }
}

exports.getItemByCode = async (req, res, next) => {

    const itemCode = req.params.code;

    try {

        const inventory = await Inventory.getItemByCode(itemCode);

        if(inventory[0].length !== 1) {
            return res.json({
                message: 'no item found'
            });
        }

        const formattedInventory = {
            ...inventory[0][0],
            last_stock_date: new Date(inventory[0][0].last_stock_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        };
        
        return res.json(formattedInventory);

    } catch (error) {
        return res.json({
            error: true,
            message: error.message
        })
    }
}