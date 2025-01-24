import {FastifyInstance} from 'fastify';
import {register} from '@/http/controllers/register.js';
import {authenticate} from "@/http/controllers/authenticate";

export async function appRoutes(app: FastifyInstance) {
    app.post('/users', register);
    app.post('/sessions', authenticate);
}
