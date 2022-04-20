import express from 'express';
const router = express.Router()

import {
    getItems,
    addItem,
    deleteItem,
    editItem
} from '../controllers/items.controller';

router.route("/items")
    .get(getItems)
    .post(addItem)
    .delete(deleteItem)
    .put(editItem)


export default router;