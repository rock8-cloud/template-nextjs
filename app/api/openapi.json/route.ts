export function GET() {
  const spec = {
    openapi: '3.0.0',
    info: { title: 'Space Targets API', version: '1.0.0' },
    paths: {
      '/api/targets': {
        get: {
          tags: ['Space Targets'],
          summary: 'Vrátí seznam všech vesmírných cílů',
          responses: {
            200: {
              description: 'OK',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/SpaceTarget' },
                  },
                },
              },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        SpaceTarget: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            type: { type: 'string' },
            distance_light_years: { type: 'number' },
          },
        },
      },
    },
  }
  return Response.json(spec)
}
