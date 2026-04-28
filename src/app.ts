import { get, html } from '@enxoval/http';
import { renderApiDocs } from '@enxoval/http';
import { setupRoutes } from './diplomat/http-server/index';
import { checkHealth } from './health/index';
import { openApiSpec } from './docs/openapi';

export function buildApp(): void {
  get('/health', () => checkHealth());
  html('/docs', async () => renderApiDocs(openApiSpec));
  setupRoutes();
}
