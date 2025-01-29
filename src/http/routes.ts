import {FastifyInstance} from 'fastify';
import {register} from '@/http/controllers/register.js';
import {authenticate} from "@/http/controllers/authenticate";
import {profile} from "@/http/controllers/profile";
import {VerifyJwt} from "@/http/middlewares/verify-jwt";

export async function appRoutes(app: FastifyInstance) {
    app.post('/users', register);

    app.post('/sessions', authenticate);

    /** Authenticated */
    app.get('/me', {onRequest: [VerifyJwt]}, profile)
}
