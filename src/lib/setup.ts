import resetDb from './reset-db';
import { beforeEach } from 'vitest';

beforeEach(async () => {
  console.log('Resetting database');
  await resetDb();
});
