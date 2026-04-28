import { registerUserRoutes } from './user';
import { registerUsersListRoutes } from './users-list';

export function setupRoutes(): void {
  registerUserRoutes();
  registerUsersListRoutes();
}
