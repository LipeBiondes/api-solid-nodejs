import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { ValidateCheckInUseCase } from '@/use-cases/validate-check-in';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';
import { LateCheckInValidationError } from '@/use-cases/errors/late-check-in-validation-error';

let checkInsRepository: InMemoryCheckInsRepository;
let sut: ValidateCheckInUseCase;

describe('Validate Check-In Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new ValidateCheckInUseCase(checkInsRepository);

    vi.useFakeTimers();
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it('Should be able to validate the check-in', async () => {
    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    });

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    });

    expect(checkIn.validated_at).toEqual(expect.any(Date));
    expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date));
  });

  it('Should not be able to validate an not-existent check-in', async () => {
    await expect(() =>
      sut.execute({
        checkInId: 'not-exist-check-in',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('Should not be able to validate the check-in after twenty minutes of its creation', async () => {
    vi.setSystemTime(new Date(2025, 0, 27, 20, 13));
    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    });

    const twentyOneMinutesInMs = 1000 * 60 * 21;
    vi.advanceTimersByTime(twentyOneMinutesInMs);

    await expect(() =>
      sut.execute({
        checkInId: createdCheckIn.id,
      }),
    ).rejects.toBeInstanceOf(LateCheckInValidationError);
  });
});
