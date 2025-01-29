import {FindManyNearbyParams, GymsRepository} from "@/repositories/gyms-repository";
import {Gym, Prisma} from "@prisma/client";
import {prisma} from "@/lib/prisma";

export class PrismaGymsRepository implements GymsRepository {
    async findById(id: string) {
        const gym = await prisma.gym.findUnique({
            where: {
                id,
            }
        })

        return gym;
    }

    async create(data: Prisma.GymCreateInput) {
        const gym = await prisma.gym.create({
            data,
        })

        return gym;
    }

    async searchMany(query: string, page: number) {
        const gyms = await prisma.gym.findMany({
            where: {
                title: {
                    contains: query,
                },
            },
            take: 20,
            skip: (page - 1) * 20,
        });

        return gyms;
    }

    async FindManyNearby({latitude, longitude}: FindManyNearbyParams) {
        const gyms = await prisma.$queryRaw<Gym[]>`
            SELECT *
            FROM gyms
            WHERE 6371 * 2 * ASIN(SQRT(
                    POWER(SIN((RADIANS(${latitude}::float) - RADIANS(gyms.latitude::float)) / 2), 2) +
                    COS(RADIANS(${latitude}::float)) * COS(RADIANS(gyms.latitude::float)) *
                    POWER(SIN((RADIANS(${longitude}::float) - RADIANS(gyms.longitude::float)) / 2), 2)
                                  )) <= 10
        `;

        return gyms;
    }

}