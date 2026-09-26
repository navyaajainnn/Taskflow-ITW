// We create ONE PrismaClient instance and reuse it everywhere.
// Creating a new one per request would exhaust database connections.
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = prisma;
