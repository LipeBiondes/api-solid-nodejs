import { beforeEach, describe, expect, it } from 'vitest';

import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { FetchNearbyGymsUseCase } from '@/use-cases/fetch-nearby-gyms';

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsUseCase(gymsRepository);
  });

  it('Should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      description: null,
      phone: null,
      latitude: -3.3061894,
      longitude: -52.5379299,
      title: 'Near Gym',
    });

    await gymsRepository.create({
      description: null,
      phone: null,
      latitude: -3.1961086,
      longitude: -52.221222,
      title: 'Fart Gym',
    });

    const { gyms } = await sut.execute({
      userLatitude: -3.3061894,
      userLongitude: -52.5379299,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })]);
  });
});
