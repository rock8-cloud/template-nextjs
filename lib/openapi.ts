const json = (schema: object) => ({ 'application/json': { schema } })
const ref = (name: string) => ({ $ref: `#/components/schemas/${name}` })

const errorResponse = (description: string) => ({ description, content: json(ref('Error')) })

const idParameter = {
  name: 'id',
  in: 'path',
  required: true,
  schema: { type: 'integer', minimum: 1 },
}

const writeErrors = {
  400: errorResponse('The input is not valid.'),
  403: errorResponse('The app runs in read-only demo mode.'),
  409: errorResponse('Another target already has this name.'),
}

const targetFields = {
  name: { type: 'string', minLength: 1, maxLength: 120, example: 'Betelgeuse' },
  type: { type: 'string', minLength: 1, maxLength: 60, example: 'Red supergiant' },
  distanceLightYears: { type: 'number', exclusiveMinimum: true, minimum: 0, example: 548 },
  description: {
    type: 'string',
    nullable: true,
    maxLength: 500,
    example: 'A bright red star in the shoulder of Orion.',
  },
}

export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Space Targets API',
    version: '1.0.0',
    description: 'A small REST API for a list of space targets, stored in PostgreSQL.',
  },
  tags: [{ name: 'Targets' }, { name: 'System' }],
  paths: {
    '/api/targets': {
      get: {
        tags: ['Targets'],
        operationId: 'listTargets',
        summary: 'List all targets',
        description: 'Returns every target, nearest first.',
        responses: {
          200: {
            description: 'The list of targets.',
            content: json({ type: 'array', items: ref('SpaceTarget') }),
          },
        },
      },
      post: {
        tags: ['Targets'],
        operationId: 'createTarget',
        summary: 'Create a target',
        requestBody: { required: true, content: json(ref('SpaceTargetCreate')) },
        responses: {
          201: { description: 'The new target.', content: json(ref('SpaceTarget')) },
          ...writeErrors,
        },
      },
    },
    '/api/targets/{id}': {
      parameters: [idParameter],
      get: {
        tags: ['Targets'],
        operationId: 'getTarget',
        summary: 'Get one target',
        responses: {
          200: { description: 'The target.', content: json(ref('SpaceTarget')) },
          400: errorResponse('The id is not valid.'),
          404: errorResponse('No target has this id.'),
        },
      },
      patch: {
        tags: ['Targets'],
        operationId: 'updateTarget',
        summary: 'Update a target',
        description: 'Send only the fields you want to change.',
        requestBody: { required: true, content: json(ref('SpaceTargetUpdate')) },
        responses: {
          200: { description: 'The updated target.', content: json(ref('SpaceTarget')) },
          ...writeErrors,
          404: errorResponse('No target has this id.'),
        },
      },
      delete: {
        tags: ['Targets'],
        operationId: 'deleteTarget',
        summary: 'Delete a target',
        responses: {
          204: { description: 'The target was deleted.' },
          400: errorResponse('The id is not valid.'),
          403: errorResponse('The app runs in read-only demo mode.'),
          404: errorResponse('No target has this id.'),
        },
      },
    },
    '/api/health': {
      get: {
        tags: ['System'],
        operationId: 'getHealth',
        summary: 'Check the app and its database',
        responses: {
          200: { description: 'The app can reach the database.', content: json(ref('Health')) },
          503: { description: 'The database is not reachable.', content: json(ref('Health')) },
        },
      },
    },
  },
  components: {
    schemas: {
      SpaceTarget: {
        type: 'object',
        required: ['id', 'name', 'type', 'distanceLightYears', 'description', 'createdAt', 'updatedAt'],
        properties: {
          id: { type: 'integer', example: 1 },
          ...targetFields,
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      SpaceTargetCreate: {
        type: 'object',
        required: ['name', 'type', 'distanceLightYears'],
        properties: targetFields,
      },
      SpaceTargetUpdate: {
        type: 'object',
        minProperties: 1,
        properties: targetFields,
      },
      Health: {
        type: 'object',
        required: ['status', 'database'],
        properties: {
          status: { type: 'string', enum: ['ok', 'error'] },
          database: { type: 'string', enum: ['up', 'down'] },
        },
      },
      Error: {
        type: 'object',
        required: ['error'],
        properties: {
          error: {
            type: 'object',
            required: ['code', 'message'],
            properties: {
              code: {
                type: 'string',
                enum: [
                  'validation_error',
                  'invalid_json',
                  'not_found',
                  'conflict',
                  'read_only',
                  'internal_error',
                ],
              },
              message: { type: 'string' },
              fields: {
                type: 'object',
                additionalProperties: { type: 'array', items: { type: 'string' } },
              },
            },
          },
        },
      },
    },
  },
}
