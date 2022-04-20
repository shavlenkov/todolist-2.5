import { Request, Response } from 'express'
import cors from 'cors'
import session from 'express-session'
import fs from 'fs'

import { Item } from '../interfaces/Item'
import { User } from '../interfaces/User'

import Users from '../models/Users';
import Items from '../models/Items';

export async function getItems(req: Request, res: Response) {
    try {

        if(!req.session.login) {
            return res.status(403).send({"error": 'forbidden'})
        }

        let user: User = await Users.findOne({"login": req.session.login});

        let items: Item[] = await Items.find({"userId": user["_id"]})

        res.send({"items": items})

    } catch(e) {
        return res.status(500).send({"error": "Internal Server Error"})
    }
}

export async function addItem(req: Request, res: Response) {
    try {

        if(!req.body.hasOwnProperty("text") || Object.keys(req.body).length != 1) {
            return res.status(400).send({"error": "bad request"})
        } else if(!req.session.login) {
            return res.status(403).send({"error": 'forbidden'})
        }

        let user: User = await Users.findOne({"login": req.session.login});

        let { text } = req.body;

        let newItem: Item = {userId: user._id, text: text, checked: false };

        let item = new Items(newItem);
        item.save();

        res.send({_id: item._id})

    } catch(e) {
        return res.status(500).send({"error": "Internal Server Error"})
    }
}

export async function deleteItem(req: Request, res: Response) {
    try {

        if(!req.body.hasOwnProperty("_id") || Object.keys(req.body).length != 1) {
            return res.status(400).send({"error": "bad request"})
        } else if(!req.session.login) {
            return res.status(403).send({"error": 'forbidden'})
        }

        let user: User = await Users.findOne({"login": req.session.login});
        let { _id } = req.body;

        await Items.findOneAndDelete({ _id: _id }, { useFindAndModify: false })

        res.send({"ok": true})

    } catch(e) {
        return res.status(500).send({"error": "Internal Server Error"})
    }
}

export async function editItem(req: Request, res: Response) {
    try {

        if(!req.body.hasOwnProperty("text") || !req.body.hasOwnProperty("checked") || !req.body.hasOwnProperty("_id") || Object.keys(req.body).length != 3 ) {
            return res.status(400).send({"error": "bad request"})
        } else if(!req.session.login) {
            return res.status(403).send({"error": 'forbidden'})
        }

        let { _id, text } = req.body;

        let item: Item = { text: text, checked: false };

        await Items.findByIdAndUpdate(_id, item, { useFindAndModify: false })

        res.send({"ok": true})
    } catch(e) {
        return res.status(500).send({"error": "Internal Server Error"})
    }
}
