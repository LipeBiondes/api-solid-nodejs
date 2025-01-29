import {FastifyReply, FastifyRequest} from "fastify";

export async function VerifyJwt(req: FastifyRequest, res: FastifyReply) {
    try {
        await req.jwtVerify();
    } catch (e) {
        res.status(401).send({
            message: "Unauthorized",
        })
    }

}