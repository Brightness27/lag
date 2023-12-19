const { validationResult } = require('express-validator');

const Category = require('../models/category');
const Inventory = require('../models/inventory');
const InventoryProcesses = require('../models/inventory_processes');

exports.addInventory = async (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);

        return res.json({
            error: true,
            message: errorMessages
        });
    }

    const name = req.body.name;
    const category  = req.body.category ;
    const quantity = req.body.quantity;
    const unit = req.body.unit;
    const last_purchase_date = req.body.last_purchase_date;
    const status = "On Stock";

    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');

    const last_stock_date = `${year}-${month}-${day}`;

    try {

        const itemExist = await Inventory.getItemByName(name);

        if(itemExist[0].length > 0) {
            return res.json({
                error: true,
                message: 'Item already on the list.'
            });
        }

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
            quantity: quantity,
            unit: unit,
            last_purchase_date: last_purchase_date,
            last_stock_date: last_stock_date,
            status: status
        }

        const inventoryId = await Inventory.addInventory(inventoryDetails);

        const itemCount = await Category.countItemByCategory(categoryId);

        const paddedInventoryId = itemCount[0][0].count.toString().padStart(4, "0");

        const paddedCategoryId = categoryId.toString().padStart(4, "0");

        const item_code = year + paddedCategoryId + paddedInventoryId;

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
            last_purchase_date: new Date(inventory.last_purchase_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
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

exports.searchInventories = async (req, res, next) => {

    const sKey = req.params.searchKey;

    try {

        const searchKey = `%${sKey}%`;


        const [inventories] = await Inventory.searchInventories(searchKey);

        const formattedInventories = inventories.map(inventory => ({
            ...inventory,
            last_purchase_date: new Date(inventory.last_purchase_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            last_stock_date: new Date(inventory.last_stock_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        }));

        return res.json(formattedInventories);

    } catch (error) {
        res.json({
            error: true,
            message: error.message
        })
    }
}

exports.updateInventory = async (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);

        return res.json({
            error: true,
            message: errorMessages
        });
    }

    const name = req.body.name;
    const category = req.body.category ;

    const item_id = req.params.itemid;

    try {

        const itemExist = await Inventory.getItemByNameExcept(name, item_id);

        if(itemExist[0].length > 0) {
            return res.json({
                error: true,
                message: 'Name already in use.'
            });
        }

        let categoryId = 0;

        const existingCategory = await Category.selectCategoryByName(category);

        if(existingCategory[0].length === 0) {
            categoryId = await Category.addcategory(category);
        }
        else {
            categoryId = existingCategory[0][0].id;
        }

        const item_details = {
            name: name,
            category: categoryId
        }

        const updateItem = await Inventory.updateItem(item_details, item_id);

        return res.json({
            error: false,
            message: 'Item Updated'
        });


    } catch (error) {
        return res.json({
            error: true,
            message: error.message
        })
    }
}

exports.processInventories = async (req, res, next) => {

    const type = req.params.type;
    const id = req.params.id;

    const stockCount = req.body.stockCount;
    const details = req.body.details;
    const last_purchase_date = req.body.last_purchase_date;

    try {

        const inventory = await Inventory.getItemByCode(id);

        const current_stock = inventory[0][0].quantity;

        if(type === 'OUT' && current_stock < stockCount) {
            return res.json({
                error: true,
                message: "not enough stock to release."
            });
        }

        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');

        let afterProcessStock = 0;

        if (type === 'IN') {
            afterProcessStock = Number(current_stock) + Number(stockCount);
        }

        else if (type === 'OUT') {
            afterProcessStock = Number(current_stock) - Number(stockCount);
        }

        const date_process = `${year}-${month}-${day}`;

        const processDetails = {
            item_code: id,
            process_count: stockCount,
            process_date: date_process,
            process_type: type,
            details: details
        };

        const updateProcess = await InventoryProcesses.updateProcess(processDetails);

        const updateStocks = await Inventory.updateStocks(afterProcessStock, id);

        if(type === 'IN') {
            const updateStockDate = await Inventory.updateStockDate(date_process, last_purchase_date, id);
        }
        

        res.json({
            error: false,
            message: "Stocks Have been Updated."
        })

    } catch (error) {
        res.json({
            error: true,
            message: error.message
        })
    }
}