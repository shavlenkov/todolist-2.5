import express, {Request, Response} from 'express';
const router = express.Router()

import {
    getItems,
    addItem,
    deleteItem,
    editItem
} from '../controllers/items.controller';

import {
    login,
    register,
    logout,
} from '../controllers/users.controller';

router.route('/router')
    .post((req, res) => {
        switch( req.query.action) {
            case "getItems":
                return getItems(req, res)
            break
            case "createItem":
                return addItem(req, res)
            break
            case "deleteItem":
                return deleteItem(req, res)
            break
            case "editItem":
                return editItem(req, res)
            break
            case "login":
                return login(req, res)
            break
            case "register":
                return register(req, res)
            break
            case "logout":
                return logout(req, res)
        }
    })

export default router;