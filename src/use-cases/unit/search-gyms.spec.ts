import { beforeEach, describe, expect, it } from 'vitest';

import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { SearchGymsUseCase } from '@/use-cases/search-gyms';

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymsUseCase;

describe('Search Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymsUseCase(gymsRepository);
  });

  it('Should be able to search for gyms', async () => {
    await gymsRepository.create({
      description: null,
      phone: null,
      latitude: -3.3046537,
      longitude: -52.5402642,
      title: 'Javascript Gym',
    });

    await gymsRepository.create({
      description: null,
      phone: null,
      latitude: -3.3046537,
      longitude: -52.5402642,
      title: 'Typescript Gym',
    });

    const { gyms } = await sut.execute({
      query: 'Javascript',
      page: 1,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Javascript Gym' }),
    ]);
  });

  it('Should be able to get paginated gyms search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        description: null,
        phone: null,
        latitude: -3.3046537,
        longitude: -52.5402642,
        title: `Javascript Gym ${i}`,
      });
    }

    const { gyms } = await sut.execute({
      query: 'Javascript',
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Javascript Gym 21' }),
      expect.objectContaining({ title: 'Javascript Gym 22' }),
    ]);
  });
});
