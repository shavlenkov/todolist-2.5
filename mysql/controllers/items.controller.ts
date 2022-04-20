import {Request, Response} from 'express'
import cors from 'cors'
import session from 'express-session'
import fs from 'fs'

import { User } from '../interfaces/User'
import { Item } from '../interfaces/Item'

import connect from '../database/connect';
import { RowDataPacket } from "mysql2";

export async function getItems(req: Request, res: Response) {
    try {

        if(!req.session.login) {
            return res.status(403).send({"error": 'forbidden'})
        }

        const sqlGetUser = `SELECT * FROM users WHERE login='${req.session.login}'`;
        const resUser = (await connect.promise().query(sqlGetUser)) as RowDataPacket;

        const user: User = resUser[0][0];

        const sqlGetItems = `SELECT * FROM items WHERE userId=${user.id}`;
        const resItems = (await connect.promise().query(sqlGetItems)) as RowDataPacket;

        const items: Item[] = resItems[0];

        res.send({"items": items})

    } catch(e) {
        res.status(500).send({"error": "Internal Server Error"})
    }
}

export async function addItem(req: Request, res: Response) {
    try {

        if(!req.body.hasOwnProperty("text") || Object.keys(req.body).length != 1) {
            return res.status(400).send({"error": "bad request"})
        } else if(!req.session.login) {
            return res.status(403).send({"error": 'forbidden'})
        }

        const sqlGetUser = `SELECT * FROM users WHERE login='${req.session.login}'`;
        const resUser = (await connect.promise().query(sqlGetUser)) as RowDataPacket;

        const user: User = resUser[0][0];

        let { text } = req.body;

        const sqlAddUser = `INSERT INTO items (userId, text, checked) VALUES (${Number(user.id)}, '${text}', false)`;

        await connect.promise().query(sqlAddUser)

        const sqlGetLastId = `SELECT MAX(id) FROM items`;
        const lastId = (await connect.promise().query(sqlGetLastId))[0] as RowDataPacket;

        res.send({id: lastId[0]["MAX(id)"]})

    } catch(e) {
        res.status(500).send({"error": "Internal Server Error"})
    }
}

export async function deleteItem(req: Request, res: Response) {

    try {

        if(!req.body.hasOwnProperty("id") || Object.keys(req.body).length != 1) {
            return res.status(400).send({"error": "bad request"})
        } else if(!req.session.login) {
            return res.status(403).send({"error": 'forbidden'})
        }

        let { id } = req.body;

        const sqlDeleteItem = `DELETE FROM items WHERE id=${Number(id)}`;

        await connect.promise().query(sqlDeleteItem)

        res.send({"ok": true})


    } catch(e) {
        res.status(500).send({"error": "Internal Server Error"})
    }
}

export async function editItem(req: Request, res: Response) {
    try {

        if(!req.body.hasOwnProperty("text") || !req.body.hasOwnProperty("checked") || !req.body.hasOwnProperty("id") || Object.keys(req.body).length != 3 ) {
            return res.status(400).send({"error": "bad request"})
        } else if(!req.session.login) {
            return res.status(403).send({"error": 'forbidden'})
        }

        let { id, text } = req.body;

        const sqlEditItem = `UPDATE items SET text='${text}' WHERE id=${Number(id)}`;

        await connect.promise().query(sqlEditItem)

        res.send({"ok": true})
    } catch(e) {
        res.status(500).send({"error": "Internal Server Error"})
    }
}
