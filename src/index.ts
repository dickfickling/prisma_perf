import { PrismaClient } from "@prisma/client";

const basePrisma = new PrismaClient({
  log: ["query"],
});

const prisma = basePrisma.$extends({
  name: "Soft Delete",
  query: {
    $allModels: {
      findUnique: ({ args, query }) => {
        return query({ ...args, where: { deletedAt: null, ...args.where } });
      },
    },
  },
});

// uncomment this to seed the db
//await prisma.user.createMany({ data: new Array(10000).fill(null).map((_, i) => ({ id: i+1, firstName: `${i}`, lastName: `${i}`, email: `${i}@${i}.co` })) })

// Works:
//const users = await Promise.all(new Array(10000).fill(null).map((_, i) => basePrisma.user.findUnique({ where: { id: i } })))

// Doesn't work:
const users = await Promise.all(new Array(10000).fill(null).map((_, i) => prisma.user.findUnique({ where: { id: i } })))


console.log(users)