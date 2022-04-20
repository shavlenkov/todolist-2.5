import {Request, Response} from 'express'
import cors from 'cors'
import session from 'express-session'
import fs from 'fs'

import connect from '../database/connect';

import {RowDataPacket} from "mysql2";
import {User} from "../interfaces/User";


export async function login(req: Request, res: Response) {
    try {

        if((!req.body.hasOwnProperty("login") || !req.body.hasOwnProperty("pass")) || Object.keys(req.body).length != 2) {
            return res.status(400).send({"error": "bad request"})
        }

        const sqlGetUser = `SELECT * FROM users WHERE login="${req.body.login}" AND pass="${req.body.pass}"`;
        let resUser = (await connect.promise().query(sqlGetUser)) as RowDataPacket;

        const user: User = resUser[0][0];

        if(user.login) {
            req.session.login = user.login;
            res.send({"ok": true})
        }

        if(!req.session.login) {
            return res.status(404).send({"error": 'not found'})
        }

    } catch(e) {
        res.status(500).send({"error": "Internal Server Error"})
    }
}

export async function register(req: Request, res: Response) {
    try {

        if((!req.body.hasOwnProperty("login") || !req.body.hasOwnProperty("pass")) || Object.keys(req.body).length != 2) {
            return res.status(400).send({"error": "bad request"})
        }

        let {login, pass} = req.body;

        req.session.login = login;

        const sqlAddUser = `INSERT INTO users (login, pass) VALUES ('${login}', '${pass}')`;

        await connect.promise().query(sqlAddUser)

        res.send({"ok": true})
    } catch(e) {
        res.status(500).send({"error": "Internal Server Error"})
    }
}

export function logout(req: Request, res: Response) {
    try {
        req.session.destroy((err:string) => {
            if (err) {
                return res.send({ 'error': 'Logout error' })
            }
            return res.send({"ok": true});
        })
    } catch(e) {
        return res.status(500).send({"error": "Internal Server Error"})
    }
}