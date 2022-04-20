import { Request, Response } from 'express'
import cors from 'cors'
import session from 'express-session'
import fs from 'fs'

import { User } from '../interfaces/User'

export function login(req: Request, res: Response) {
    try {

        if((!req.body.hasOwnProperty("login") || !req.body.hasOwnProperty("pass")) || Object.keys(req.body).length != 2) {
            return res.status(400).send({"error": "bad request"})
        }

        let users: User[] = JSON.parse(fs.readFileSync("./database/users.json", "utf8"))["users"];

        for(let i = 0; i < users.length; i++) {
            if(users[i].login == req.body.login && users[i].pass == req.body.pass) {
                req.session.login = users[i].login;
                res.send({"ok": true})
            }
        }

        if(!req.session.login) {
            return res.status(404).send({"error": 'not found'})
        }

    } catch(e) {
        res.status(500).send({"error": "Internal Server Error"})
    }
}

export function register(req: Request, res: Response) {
    try {

        if((!req.body.hasOwnProperty("login") || !req.body.hasOwnProperty("pass")) || Object.keys(req.body).length != 2) {
            return res.status(400).send({"error": "bad request"})
        }

        let users: User[] = JSON.parse(fs.readFileSync("./database/users.json", "utf8"))["users"];

        req.session.login = req.body.login;

        let newUser: User = {
            login: req.body.login,
            pass: req.body.pass,
            items: []
        }

        users.push(newUser)

        fs.writeFileSync("./database/users.json", "");
        fs.writeFileSync("./database/users.json", JSON.stringify({users: users}));

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