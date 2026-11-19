import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

BigInt.prototype.toJSON = function () {
  return Number(this);
};

const poll = new pg.Pool({ connectionString: process.env.DATABASE_URL })

const adapter = new PrismaPg(poll)

const prisma = new PrismaClient({
    adapter,
    log: 
        process.env.NODE_ENV === 'development'
        ? ['query', 'warn', 'error']
        : ['error']
})
export default prisma