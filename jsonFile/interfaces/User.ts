import { Item } from './Item';

export interface User {
    login: string,
    pass: string,
    items: Item[]
}