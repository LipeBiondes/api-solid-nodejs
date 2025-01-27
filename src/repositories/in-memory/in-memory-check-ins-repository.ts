import {randomUUID} from "node:crypto"

import {CheckIn, Prisma} from "@prisma/client";
import {CheckInsRepository} from "@/repositories/check-ins-repository";
import dayjs from "dayjs";

export class InMemoryCheckInsRepository implements CheckInsRepository {
    public items: CheckIn[] = [];

    async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
        const checkIn = {
            id: randomUUID(),
            user_id: data.user_id,
            gym_id: data.gym_id,
            validated_at: data.validated_at ? new Date(data.validated_at) : null,
            created_at: new Date(),
        }

        this.items.push(checkIn);

        return checkIn;
    }

    async findByUserIdOnDate(userId: string, date: Date) {
        const startOfDay = dayjs(date).startOf('date');
        const endOfDay = dayjs(date).endOf('date');

        const checkInOnSameDate = this.items.find(checkIn => {
            const checkInDate = dayjs(checkIn.created_at);
            const isOnSameDate = checkInDate.isAfter(startOfDay) && checkInDate.isBefore(endOfDay);
            return checkIn.user_id === userId && isOnSameDate;
        });
        if (!checkInOnSameDate) {
            return null;
        }
        return checkInOnSameDate;
    }

    async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
        return this.items
            .filter(item => item.user_id === userId)
            .slice((page - 1) * 20, page * 20);
    }

}