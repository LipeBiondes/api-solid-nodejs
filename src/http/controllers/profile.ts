import {FastifyReply, FastifyRequest} from 'fastify'
import {makeGetUserProfileUseCase} from "@/use-cases/factories/make-get-user-profile-use-case";

export async function profile(request: FastifyRequest, reply: FastifyReply) {
    await request.jwtVerify();

    const getUserProfile = makeGetUserProfileUseCase();
    const {user} = await getUserProfile.execute({
        userId: request.user.sub
    })


    reply.status(201).send({
        user: {
            ...user,
            password_hash: undefined,
        },
    });
}
