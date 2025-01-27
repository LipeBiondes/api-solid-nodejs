import {afterAll, beforeEach, describe, expect, it, vi} from "vitest";
import {Decimal} from "@prisma/client/runtime/binary";

import {CheckInUseCase} from "@/use-cases/check-in";
import {InMemoryCheckInsRepository} from "@/repositories/in-memory/in-memory-check-ins-repository";
import {InMemoryGymsRepository} from "@/repositories/in-memory/in-memory-gyms-repository";
import {MaxDistanceError} from "@/use-cases/errors/max-distance-error";
import {MaxNumberOfCheckInsError} from "@/use-cases/errors/max-number-of-check-ins.error";

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe('Check-In Use Case', () => {
    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository();
        gymsRepository = new InMemoryGymsRepository();
        sut = new CheckInUseCase(checkInsRepository, gymsRepository);

        await gymsRepository.create({
            id: "gym-id-01",
            title: "javascript-gym",
            description: "null",
            phone: "00 00000-0000",
            latitude: -3.3046537,
            longitude: -52.5402642,
        })

        vi.useFakeTimers();
    })

    afterAll(() => {
        vi.useRealTimers();
    })

    it('should be able to check in', async () => {
        const {checkIn} = await sut.execute({
            gymId: "gym-id-01",
            userId: "user-id-01",
            userLatitude: -3.3046537,
            userLongitude: -52.5402642,
        });

        expect(checkIn.id).toEqual(expect.any(String));
    });

    it('should not be able to check in twice the same day', async () => {
        vi.setSystemTime(new Date(2025, 0, 10, 8, 0, 0));

        await sut.execute({
            gymId: "gym-id-01",
            userId: "user-id-01",
            userLatitude: -3.3046537,
            userLongitude: -52.5402642,
        });

        await expect(() => sut.execute({
            gymId: "gym-id-01",
            userId: "user-id-01",
            userLatitude: -3.3046537,
            userLongitude: -52.5402642,
        })).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
    });

    it('should not be able to check in twice but in different days', async () => {
        vi.setSystemTime(new Date(2025, 0, 10, 8, 0, 0));

        await sut.execute({
            gymId: "gym-id-01",
            userId: "user-id-01",
            userLatitude: -3.3046537,
            userLongitude: -52.5402642,
        });

        vi.setSystemTime(new Date(2025, 0, 11, 8, 0, 0));

        const {checkIn} = await sut.execute({
            gymId: "gym-id-01",
            userId: "user-id-01",
            userLatitude: -3.3046537,
            userLongitude: -52.5402642,
        });

        expect(checkIn.id).toEqual(expect.any(String));
    });

    it('should not be able to check in on distant gym', async () => {
        gymsRepository.items.push({
            id: "gym-id-02",
            title: "javascript-gym",
            description: "null",
            phone: "00 00000-0000",
            latitude: new Decimal(-3.2971466),
            longitude: new Decimal(-52.4872211)
        })

        await expect(() => sut.execute({
                gymId: "gym-id-02",
                userId: "user-id-01",
                userLatitude: -3.3046537,
                userLongitude: -52.5402642,
            })
        ).rejects.toBeInstanceOf(MaxDistanceError);
    });


})