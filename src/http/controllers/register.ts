import {FastifyRequest, FastifyReply} from 'fastify'
import {z} from 'zod'

import {RegisterUseCase} from '@/use-cases/register.js'
import {PrismaUsersRepository} from "@/repositories/prisma/prisma-users-repository.js";
import {UserAlreadyExistsError} from "@/use-cases/errors/user-already-exists-error.js";

export async function register(request: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6)
    })

    const {email, name, password} = registerBodySchema.parse(request.body);

    try {
        const usersRepository = new PrismaUsersRepository();

        const registerUseCase = new RegisterUseCase(usersRepository);

        await registerUseCase.execute({name, email, password});
    } catch (e) {
        if (e instanceof UserAlreadyExistsError) {
            return reply.status(409).send({"message": e.message});
        }
        throw e;
    }

    reply.status(201).send();
}
