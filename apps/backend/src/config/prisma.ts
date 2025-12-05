// Import PrismaClient from the Prisma package
import { PrismaClient } from "@prisma/client";
// Create a single instance of PrismaClient to interact with the database
export const prisma = new PrismaClient();
// Now you can use 'prisma' to query your database throughout your project