import { PrismaClient} from "@prisma/client";
/* eslint no-var: off */
declare global {
    var prisma: PrismaClient | undefined;
};

const prismadb = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = prismadb;

export default prismadb;