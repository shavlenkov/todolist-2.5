import { Request, Response } from 'express'
import cors from 'cors'
import session from 'express-session'
import fs from 'fs'

import { Item } from '../interfaces/Item'
import { User } from '../interfaces/User'

export function getItems(req: Request, res: Response) {
    try {

        if(!req.session.login) {
            return res.status(403).send({"error": 'forbidden'})
        }

        let users: User[] = JSON.parse(fs.readFileSync("./database/users.json", "utf8"))["users"];

        for(let i = 0; i < users.length; i++) {
            if(users[i].login == req.session.login) {
                res.send(users[i])
            }
        }
    } catch(e) {
        res.status(500).send({"error": "Internal Server Error"})
    }
}

export function addItem(req: Request, res: Response) {
    try {

        if(!req.body.hasOwnProperty("text") || Object.keys(req.body).length != 1) {
            return res.status(400).send({"error": "bad request"})
        } else if(!req.session.login) {
            return res.status(403).send({"error": 'forbidden'})
        }

        let users: User[] = JSON.parse(fs.readFileSync("./database/users.json", "utf8"))["users"];

        for(let i = 0; i < users.length; i++) {
            if(users[i].login == req.session.login) {
                let id = users[i]["items"].length == 0 ? 1 : users[i]["items"].slice(-1)[0].id + 1;

                let { text } = req.body;

                let item: Item = {id: id, text: text, checked: false};

                users[i]["items"].push(item);

                fs.writeFileSync("./database/users.json", "");
                fs.writeFileSync("./database/users.json", JSON.stringify({users: users}));

                res.send({id: id})
            }
        }

    } catch(e) {
        res.status(500).send({"error": "Internal Server Error"})
    }
}

export function deleteItem(req: Request, res: Response) {
    try {

        if(!req.body.hasOwnProperty("id") || Object.keys(req.body).length != 1) {
            return res.status(400).send({"error": "bad request"})
        } else if(!req.session.login) {
            return res.status(403).send({"error": 'forbidden'})
        }

        let users: User[] = JSON.parse(fs.readFileSync("./database/users.json", "utf8"))["users"];
        let { id } = req.body;

        for(let i = 0; i < users.length; i++) {
            if(users[i].login == req.session.login ) {
                for(let j = 0; j < users[i]["items"].length; j++) {
                    if (users[i]["items"][j].id === id) {
                        users[i]["items"].splice(j, 1);
                    }
                }

                fs.writeFileSync("./database/users.json", "");
                fs.writeFileSync("./database/users.json", JSON.stringify({users: users}));

                res.send({"ok": true})
            }
        }
    } catch(e) {
        res.status(500).send({"error": "Internal Server Error"})
    }
}

export function editItem(req: Request, res: Response) {
    try {

        if(!req.body.hasOwnProperty("id") || !req.body.hasOwnProperty("text") || !req.body.hasOwnProperty("checked") || Object.keys(req.body).length != 3) {
            return res.status(400).send({"error": "bad request"})
        } else if(!req.session.login) {
            return res.status(403).send({"error": 'forbidden'})
        }

        let users: User[] = JSON.parse(fs.readFileSync("./database/users.json", "utf8"))["users"];
        let { id, text } = req.body;

        let item: Item = {id: id, text: text, checked: false};

        for(let i = 0; i < users.length; i++) {
            if(users[i].login == req.session.login ) {
                for (let j = 0; j < users[i]["items"].length; j++) {
                    if (users[i]["items"][j].id === id) {
                        users[i]["items"][j] = item
                    }
                }

            }
        }

        fs.writeFileSync("./database/users.json", "");
        fs.writeFileSync("./database/users.json", JSON.stringify({users: users}));

        res.send({"ok": true})
    } catch(e) {
        res.status(500).send({"error": "Internal Server Error"})
    }
}