import { ROLES } from '../model/user';

export const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Atreides API',
    version: '1.0.0',
    description: 'User identity service.',
  },
  servers: [{ url: 'http://localhost:3002', description: 'Local' }],
  paths: {
    '/health': {
      get: {
        summary: 'Health check',
        operationId: 'getHealth',
        tags: ['System'],
        responses: {
          '200': {
            description: 'Service health status',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', enum: ['ok', 'degraded'] },
                    dependencies: {
                      type: 'object',
                      properties: {
                        database: { type: 'boolean' },
                        kafka: { type: 'boolean' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/users': {
      post: {
        summary: 'Create a new user',
        operationId: 'createUser',
        tags: ['Users'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password', 'role'],
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string' },
                  role: { type: 'string', enum: [...ROLES] },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'User created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/User' },
              },
            },
          },
        },
      },
      get: {
        summary: 'List all users',
        operationId: 'listUsers',
        tags: ['Users'],
        responses: {
          '200': {
            description: 'List of users',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/User' } },
              },
            },
          },
        },
      },
    },
    '/users/confirm-email': {
      post: {
        summary: 'Confirm user email',
        operationId: 'confirmEmail',
        tags: ['Users'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['id'],
                properties: { id: { type: 'string', format: 'uuid' } },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Email confirmed',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/User' },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          emailVerified: { type: 'boolean' },
          role: { type: 'string', enum: [...ROLES] },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
};
