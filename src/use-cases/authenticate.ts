import {UsersRepository} from "@/repositories/users-repository";
import {InvalidCredentialsError} from "@/use-cases/errors/invalid-credentials-error";
import {compare} from "bcryptjs";
import {User} from "@prisma/client";

interface AuthenticateUseCaseRequest {
    email: string;
    password: string;
}

interface AuthenticateUserCaseResponse {
    user: User
}

export class AuthenticateUseCase {
    constructor(private usersRepository: UsersRepository) {
    }

    async execute({email, password}: AuthenticateUseCaseRequest): Promise<AuthenticateUserCaseResponse> {
        const user = await this.usersRepository.findByEmail(email);
        if (!user) {
            throw new InvalidCredentialsError();
        }

        const doesPasswordMatch = await compare(password, user.password_hash);
        if (!doesPasswordMatch) {
            throw new InvalidCredentialsError();
        }

        return {
            user,
        }
    }
}