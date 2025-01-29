import { FetchUserCheckInsHistoryUseCase } from '@/use-cases/fetch-user-check-ins-history';
import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository';

export function makeFetchUserCheckInsUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository();
  return new FetchUserCheckInsHistoryUseCase(checkInsRepository);
}
