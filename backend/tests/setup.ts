import dotenv from 'dotenv';
import { beforeAll } from 'vitest';
import { db } from '../src/prisma/db.js';

dotenv.config({
  path: '.env.test',
  override: true,
});

export let testUserId: number;

beforeAll(async () => {
  const users = await db.orm.public.User.all();

  const existingUser = users.find(
    (user) => user.email === 'sav@example.com',
  );

  if (existingUser) {
    testUserId = existingUser.id;
    return;
  }

  const user = await db.orm.public.User.create({
    name: 'Sav',
    email: 'sav@example.com',
  });

  testUserId = user.id;
});