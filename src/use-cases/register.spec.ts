import {expect, describe, it} from "vitest";

import {compare} from "bcryptjs";
import {InMemoryUsersRepository} from "@/repositories/in-memory/in-memory-users-repository";
import {RegisterUseCase} from "@/use-cases/register";
import {UserAlreadyExistsError} from "@/use-cases/errors/user-already-exists-error";

describe('Register Use Case', () => {
    it('should be able to register', async () => {
        const usersRepository = new InMemoryUsersRepository();
        const sut = new RegisterUseCase(usersRepository);

        const {user} = await sut.execute({
            name: "John Doe",
            email: "john@example.com",
            password: "123456",
        });

        expect(user.id).toEqual(expect.any(String));
    });

    it('should hash user password upon registration', async () => {
        const usersRepository = new InMemoryUsersRepository();
        const sut = new RegisterUseCase(usersRepository);

        const {user} = await sut.execute({
            name: "John Doe",
            email: "john@example.com",
            password: "123456",
        });

        const isPasswordCorrectlyHashed = await compare("123456", user.password_hash);

        expect(isPasswordCorrectlyHashed).toBe(true)
    });

    it('should not able to register with same email twice', async () => {
        const usersRepository = new InMemoryUsersRepository();
        const sut = new RegisterUseCase(usersRepository);

        const email = "john@example.com";

        await sut.execute({
            name: "John Doe",
            email,
            password: "123456",
        });

        await expect(() =>
            sut.execute({
                name: "John Doe",
                email,
                password: "123456",
            })
        ).rejects.toBeInstanceOf(UserAlreadyExistsError);
    });
})