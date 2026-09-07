#!/bin/sh

set -e

echo "Updating main database schema..."

npx prisma db update

echo "Updating test database schema..."

DATABASE_URL="postgresql://postgres:postgres@postgres:5432/tradeblotter_test" \
  npx prisma db update

echo "Seeding main database if empty..."

npm run seed

echo "Starting backend..."

exec npm start