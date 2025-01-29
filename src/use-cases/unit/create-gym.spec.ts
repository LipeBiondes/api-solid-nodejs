import { beforeEach, describe, expect, it } from 'vitest';

import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { CreateGymUseCase } from '@/use-cases/create-gym';

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

describe('Register Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(gymsRepository);
  });

  it('Should be able to create gym', async () => {
    const { gym } = await sut.execute({
      title: 'Academia do javascript',
      description: null,
      phone: null,
      latitude: -3.3046537,
      longitude: -52.5402642,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
