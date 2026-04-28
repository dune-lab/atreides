import { createTestDataSource } from '@enxoval/testing';
import { UserSchema } from '../../../src/db/wire/user';

export const TestDataSource = createTestDataSource([UserSchema]);
