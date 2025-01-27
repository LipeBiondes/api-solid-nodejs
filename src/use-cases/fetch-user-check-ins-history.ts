import {CheckIn} from '@prisma/client'
import {CheckInsRepository} from '@/repositories/check-ins-repository'

interface FetchUserCheckInsHistoryUseCaseRequest {
    userId: string;
    page: number;
}

interface FetchUsersCheckInsHistoryUserCaseResponse {
    checkIns: CheckIn[];
}

export class FetchUserCheckInsHistoryUseCase {
    constructor(private checkInsRepository: CheckInsRepository) {
    }

    async execute({
                      userId,
                      page
                  }: FetchUserCheckInsHistoryUseCaseRequest): Promise<FetchUsersCheckInsHistoryUserCaseResponse> {
        const checkIns = await this.checkInsRepository.findManyByUserId(userId, page);

        return {
            checkIns,
        }
    }
}
