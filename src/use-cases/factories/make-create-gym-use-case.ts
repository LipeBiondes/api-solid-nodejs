import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository';
import { CreateGymUseCase } from '@/use-cases/create-gym';

export function makeCreateGymUseCase() {
  const gymsRepository = new PrismaGymsRepository();
  return new CreateGymUseCase(gymsRepository);
}
