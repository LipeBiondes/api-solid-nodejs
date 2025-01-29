import {defineEnvironment} from 'vitest/environment';

export default defineEnvironment({
    name: 'prisma',
    async setup() {
        console.log('Setup');

        // Configuração do ambiente (ex: inicializar o cliente do Prisma)
        // ...

        return {
            async teardown() {
                console.log('Teardown');
                // Limpeza do ambiente (ex: fechar conexões do Prisma)
                // ...
            },
        };
    },
});