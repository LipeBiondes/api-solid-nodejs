import {prisma} from "@/lib/prisma.js";
import {Prisma, User} from "@prisma/client";

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

    findById(userId: string): Promise<User | null> {
        return prisma.user.findUnique({where: {id: userId}});
    }
}