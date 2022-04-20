import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import session from 'express-session'

import routerItems from './routes/items.route';
import routerUsers from './routes/users.route';

import router from "./routes/router";

const app = express();

const host:string = '127.0.0.1';
const port:number  = 3005;

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))

app.use(bodyParser.json());

app.use(
    express.static("public")
);

app.use(session({
    secret: 'todolist-2.5',
    resave: false,
    saveUninitialized: true,
}));

declare module 'express-session' {
    interface SessionData {
        login: string
    }
}

app.use('/api/v1', routerUsers, routerItems)
app.use('/api/v2', router)

app.listen(port, host, function () {
    console.log(`Server listens http://${host}:${port}`);
});