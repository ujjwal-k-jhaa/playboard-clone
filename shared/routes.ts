import { z } from 'zod';
import { insertChannelSchema, insertVideoSchema, channels, videos, dailyStats } from './schema';

// ============================================
// SHARED ERROR SCHEMAS
// ============================================
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

// ============================================
// API CONTRACT
// ============================================
export const api = {
  channels: {
    list: {
      method: 'GET' as const,
      path: '/api/channels',
      input: z.object({
        category: z.string().optional(),
        country: z.string().optional(),
        sortBy: z.enum(['subscribers', 'views', 'growth']).optional(),
        limit: z.coerce.number().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof channels.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/channels/:id',
      responses: {
        200: z.custom<typeof channels.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    getStats: {
      method: 'GET' as const,
      path: '/api/channels/:id/stats',
      responses: {
        200: z.array(z.custom<typeof dailyStats.$inferSelect>()),
        404: errorSchemas.notFound,
      },
    },
  },
  videos: {
    list: {
      method: 'GET' as const,
      path: '/api/videos',
      input: z.object({
        channelId: z.string().optional(),
        isLive: z.boolean().optional(),
        sortBy: z.enum(['views', 'likes', 'revenue', 'date']).optional(),
        limit: z.coerce.number().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof videos.$inferSelect & { channel?: typeof channels.$inferSelect }>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/videos/:id',
      responses: {
        200: z.custom<typeof videos.$inferSelect & { channel: typeof channels.$inferSelect }>(),
        404: errorSchemas.notFound,
      },
    },
  },
  rankings: {
    superChat: {
      method: 'GET' as const,
      path: '/api/rankings/super-chat',
      input: z.object({
        period: z.enum(['daily', 'weekly', 'monthly', 'all-time']).optional(),
        limit: z.coerce.number().optional(),
      }).optional(),
      responses: {
        200: z.array(z.object({
          rank: z.number(),
          channel: z.custom<typeof channels.$inferSelect>(),
          revenue: z.number(),
        })),
      },
    },
    growth: {
      method: 'GET' as const,
      path: '/api/rankings/growth',
      input: z.object({
        period: z.enum(['daily', 'weekly', 'monthly']).optional(),
        limit: z.coerce.number().optional(),
      }).optional(),
      responses: {
        200: z.array(z.object({
          rank: z.number(),
          channel: z.custom<typeof channels.$inferSelect>(),
          subscribersGained: z.number(),
        })),
      },
    },
  },
};

// ============================================
// REQUIRED: buildUrl helper
// ============================================
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

// ============================================
// TYPE HELPERS
// ============================================
export type ChannelListResponse = z.infer<typeof api.channels.list.responses[200]>;
export type ChannelResponse = z.infer<typeof api.channels.get.responses[200]>;
export type VideoListResponse = z.infer<typeof api.videos.list.responses[200]>;
export type SuperChatRankingResponse = z.infer<typeof api.rankings.superChat.responses[200]>;
