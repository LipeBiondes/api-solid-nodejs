import { Gym, Prisma } from '@prisma/client';

export interface FindManyNearbyParams {
  latitude: number;
  longitude: number;
}

export interface GymsRepository {
  findById(id: string): Promise<Gym | null>;

  create(data: Prisma.GymCreateInput): Promise<Gym>;

  searchMany(id: string, page: number): Promise<Gym[]>;

  FindManyNearby(params: FindManyNearbyParams): Promise<Gym[]>;
}
