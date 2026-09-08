import 'dotenv/config';

import { db } from './db.js';

const symbols = [
    'AAPL',
    'MSFT',
    'GOOGL',
    'AMZN',
    'TSLA',
    'NVDA',
    'META',
    'JPM',
    'V',
    'NFLX',
];

const traders = [
    'Alice',
    'Bob',
    'Charlie',
    'Diana',
    'Ethan',
];

const users = [
    {
        name: 'Sav',
        email: 'sav@example.com',
    },
    {
        name: 'Guest',
        email: 'guest@example.com',
    },
];

const sides = ['BUY', 'SELL'] as const;

function randomItem<T>(items: readonly T[]): T {
    return items[Math.floor(Math.random() * items.length)]!;
}

function randomQuantity(): number {
    return Math.floor(Math.random() * 1000) + 1;
}

function randomPrice(): number {
    return Number((Math.random() * 500 + 50).toFixed(2));
}

function randomDate(): string {
    const now = Date.now();
    const daysAgo = Math.floor(Math.random() * 30);

    return new Date(
        now - daysAgo * 24 * 60 * 60 * 1000,
    ).toISOString();
}

async function main() {
    const existingUser = await db.orm.public.User.first();

    let createdUsers;

    if (existingUser) {
        console.log('Users already exist. Skipping user seed.');
        createdUsers = await db.orm.public.User.all();
    } else {
        console.log('Seeding users...');

        createdUsers = await db.orm.public.User.createAll(users);

        console.log(`Created ${createdUsers.length} users.`);
    }

    const existingTrade = await db.orm.public.Trade.first();

    if (existingTrade) {
        console.log('Trades already exist. Skipping trade seed.');
        return;
    }

    console.log('Seeding trades...');

    const trades = Array.from({ length: 100 }, () => ({
    symbol: randomItem(symbols),
    quantity: randomQuantity(),
    price: randomPrice(),
    side: randomItem(sides),
    trader: randomItem(traders),
    tradeTimestamp: randomDate(),
    status: 'ACTIVE' as const,
}));

    await db.orm.public.Trade.createAll(trades);

    console.log(`Created ${trades.length} trades.`);
}

main()
    .catch((error) => {
        console.error('Seed failed:', error);
        process.exit(1);
    })
    .finally(async () => {
        await db.close();
    });