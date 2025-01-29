import { FastifyReply, FastifyRequest } from 'fastify';

export async function VerifyJwt(req: FastifyRequest, res: FastifyReply) {
  try {
    await req.jwtVerify();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    res.status(401).send({
      message: 'Unauthorized',
    });
  }
}
