import { Request, Response } from 'express'
import cors from 'cors'
import session from 'express-session'
import fs from 'fs'

import { User } from '../interfaces/User'

import Users from "../models/Users";

export async function login(req: Request, res: Response) {
    try {

        if((!req.body.hasOwnProperty("login") || !req.body.hasOwnProperty("pass")) || Object.keys(req.body).length != 2) {
            return res.status(400).send({"error": "bad request"})
        }

        let user: User = await Users.findOne({"login": req.body.login});

        if(user.login == req.body.login && user.pass == req.body.pass) {
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

        let newUser = {
            login: req.body.login,
            pass: req.body.pass
        }

        req.session.login = req.body.login;

        let user = new Users(newUser)
        user.save();

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