import {prisma} from "@/lib/prisma.js";
import {Prisma} from "@prisma/client";

import {UsersRepository} from "@/repositories/users-repository.js";

export class PrismaUsersRepository implements UsersRepository {
    async create(data: Prisma.UserCreateInput) {
        return prisma.user.create({
            data
        });
    }

    async findByEmail(email: string) {
        return prisma.user.findUnique({where: {email}});
    }
}