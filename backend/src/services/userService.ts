import { db } from '../prisma/db.js';

export async function getUsers() {
    return db.orm.public.User.all();
}